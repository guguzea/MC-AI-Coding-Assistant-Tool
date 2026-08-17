/**
 * 用 java-parser（Chevrotain CST）抽取具名类型与方法签名。
 * 禁止用正则当签名源；解析失败记 parseError，不回退正则。
 * 本模块较重，禁止被 query_loader_api 静态导入（ingest / 抽取脚本动态或脚本入口加载）。
 */
import { parse } from "java-parser";
import type { LoaderApiSummary, LoaderClassRecord, MethodInfo } from "./types.js";

interface CstNode {
  name?: string;
  image?: string;
  startOffset?: number;
  children?: Record<string, CstNode[] | undefined>;
}

const NESTED_STOP = new Set([
  "methodDeclaration",
  "interfaceMethodDeclaration",
  "constructorDeclaration",
  "compactConstructorDeclaration",
  "annotationInterfaceElementDeclaration",
]);

const TYPE_NODE = new Set([
  "classDeclaration",
  "interfaceDeclaration",
  "enumDeclaration",
  "recordDeclaration",
  "annotationInterfaceDeclaration",
  "annotationTypeDeclaration",
]);

function kids(node: CstNode | undefined, key: string): CstNode[] {
  const arr = node?.children?.[key];
  return Array.isArray(arr) ? arr : [];
}

function first(node: CstNode | undefined, key: string): CstNode | undefined {
  return kids(node, key)[0];
}

function isToken(n: CstNode | undefined): n is CstNode & { image: string; startOffset: number } {
  return !!n && typeof n.image === "string" && typeof n.startOffset === "number" && !n.children;
}

function collectTokens(node: CstNode | undefined, acc: Array<{ image: string; startOffset: number }>): void {
  if (!node) return;
  if (isToken(node)) {
    acc.push({ image: node.image, startOffset: node.startOffset });
    return;
  }
  if (typeof node.image === "string" && typeof node.startOffset === "number" && !node.children) {
    acc.push({ image: node.image, startOffset: node.startOffset });
    return;
  }
  if (!node.children) return;
  for (const arr of Object.values(node.children)) {
    if (!Array.isArray(arr)) continue;
    for (const c of arr) collectTokens(c, acc);
  }
}

function cstImage(node: CstNode | undefined): string {
  const tokens: Array<{ image: string; startOffset: number }> = [];
  collectTokens(node, tokens);
  tokens.sort((a, b) => a.startOffset - b.startOffset);
  return tokens.map((t) => t.image).join("");
}

function identifierImage(node: CstNode | undefined): string {
  if (!node) return "";
  if (isToken(node)) return node.image;
  const id = first(node, "Identifier") ?? node;
  if (isToken(id)) return id.image;
  return cstImage(node);
}

function packageName(unit: CstNode): string {
  const pkg = first(unit, "packageDeclaration");
  if (!pkg) return "";
  const ids = kids(pkg, "Identifier").map((t) => (isToken(t) ? t.image : identifierImage(t))).filter(Boolean);
  return ids.join(".");
}

function typeModifiers(decl: CstNode): string[] {
  const out: string[] = [];
  for (const key of ["classModifier", "interfaceModifier", "enumModifier", "recordModifier", "annotationTypeModifier"]) {
    for (const m of kids(decl, key)) {
      const img = cstImage(m).trim();
      if (img && !img.startsWith("@")) out.push(img);
    }
  }
  return out;
}

/** 只读本类型声明上的注解，不扫整个文件、不进入方法体。 */
function annotationTextFromDecl(decl: CstNode | undefined): string {
  if (!decl) return "";
  const chunks: string[] = [];
  for (const key of ["classModifier", "interfaceModifier", "enumModifier", "recordModifier", "annotationTypeModifier"]) {
    for (const m of kids(decl, key)) chunks.push(cstImage(m));
  }
  for (const a of kids(decl, "annotation")) chunks.push(cstImage(a));
  return chunks.join(" ");
}

function flagsFromAnnotations(text: string): { apiStatusInternal: boolean; environment: boolean } {
  return {
    apiStatusInternal: /@ApiStatus\.Internal\b/.test(text) || /ApiStatus\.Internal/.test(text),
    environment: /@Environment\b/.test(text) || /@OnlyIn\b/.test(text),
  };
}

function methodModifiers(method: CstNode): string[] {
  const out: string[] = [];
  for (const key of ["methodModifier", "interfaceMethodModifier", "constructorModifier", "annotationInterfaceElementModifier"]) {
    for (const m of kids(method, key)) {
      const img = cstImage(m).trim();
      if (img && !img.startsWith("@")) out.push(img);
    }
  }
  return out;
}

function paramName(param: CstNode): string {
  const regular = first(param, "variableParaRegularParameter") ?? param;
  const id = first(regular, "variableDeclaratorId");
  const img = identifierImage(id) || identifierImage(first(regular, "Identifier"));
  return img.replace(/\[\]/g, "").trim();
}

function paramType(param: CstNode): string {
  const regular = first(param, "variableParaRegularParameter") ?? param;
  const ty = first(regular, "unannType");
  let t = cstImage(ty);
  if (first(regular, "DotDotDot") || kids(param, "DotDotDot").length) {
    t += "...";
  }
  const dims = first(regular, "dims");
  if (dims) t += cstImage(dims);
  return t || "?";
}

function extractParams(declarator: CstNode | undefined): MethodInfo["parameters"] {
  const list = first(declarator, "formalParameterList");
  if (!list) return [];
  return kids(list, "formalParameter").map((p) => ({
    type: paramType(p) || "?",
    name: paramName(p) || "arg",
  }));
}

function extractMethod(method: CstNode): MethodInfo | null {
  const header = first(method, "methodHeader");
  if (!header) return null;
  const declarator = first(header, "methodDeclarator");
  const nameTok = first(declarator, "Identifier");
  const name = isToken(nameTok) ? nameTok.image : identifierImage(nameTok);
  if (!name) return null;
  const result = first(header, "result");
  const returnType = cstImage(result) || "void";
  const parameters = extractParams(declarator);
  const modifiers = methodModifiers(method);
  const signature = `${returnType} ${name}(${parameters.map((p) => p.type).join(", ")})`;
  return { name, returnType, parameters, modifiers, signature };
}

function extractConstructor(ctor: CstNode, fallbackName: string): MethodInfo | null {
  const declarator = first(ctor, "constructorDeclarator") ?? ctor;
  const nameNode =
    first(declarator, "simpleTypeName") ??
    first(ctor, "simpleTypeName") ??
    first(declarator, "typeIdentifier");
  const name = identifierImage(nameNode) || fallbackName;
  if (!name) return null;
  const parameters = extractParams(declarator);
  const modifiers = methodModifiers(ctor);
  const signature = `${name}(${parameters.map((p) => p.type).join(", ")})`;
  return { name, returnType: name, parameters, modifiers, signature };
}

function extractCompactConstructor(
  ctor: CstNode,
  typeName: string,
  recordParams: MethodInfo["parameters"],
): MethodInfo {
  const name = identifierImage(first(ctor, "simpleTypeName")) || typeName;
  const modifiers = [...methodModifiers(ctor), "compact"];
  const signature = `${name}(${recordParams.map((p) => p.type).join(", ")})`;
  return { name, returnType: name, parameters: recordParams, modifiers, signature };
}

function extractAnnoElement(el: CstNode): MethodInfo | null {
  const name = identifierImage(first(el, "Identifier"));
  if (!name) return null;
  const returnType = cstImage(first(el, "unannType")) || "?";
  const modifiers = methodModifiers(el);
  const signature = `${returnType} ${name}()`;
  return { name, returnType, parameters: [], modifiers, signature };
}

function recordComponents(decl: CstNode): MethodInfo["parameters"] {
  const rec = first(decl, "recordDeclaration") ?? (decl.name === "recordDeclaration" ? decl : undefined);
  if (!rec) return [];
  const header = first(rec, "recordHeader");
  const list = first(header, "recordComponentList");
  if (!list) return [];
  return kids(list, "recordComponent").map((c, i) => {
    const ty = cstImage(first(c, "unannType")) || "?";
    const arity = first(c, "variableArityRecordComponent");
    const name =
      identifierImage(first(c, "Identifier")) ||
      identifierImage(first(arity, "Identifier")) ||
      `comp${i}`;
    const dots = arity || first(c, "DotDotDot") ? "..." : "";
    return { type: ty + dots, name };
  });
}

function collectMethods(body: CstNode | undefined, typeName: string, recordParams: MethodInfo["parameters"]): MethodInfo[] {
  if (!body) return [];
  const out: MethodInfo[] = [];
  const visit = (n: CstNode) => {
    const name = n.name;
    if (name && TYPE_NODE.has(name)) return;
    if (name === "methodDeclaration" || name === "interfaceMethodDeclaration") {
      const info = extractMethod(n);
      if (info) out.push(info);
      return;
    }
    if (name === "constructorDeclaration") {
      const info = extractConstructor(n, typeName);
      if (info) out.push(info);
      return;
    }
    if (name === "compactConstructorDeclaration") {
      out.push(extractCompactConstructor(n, typeName, recordParams));
      return;
    }
    if (name === "annotationInterfaceElementDeclaration") {
      const info = extractAnnoElement(n);
      if (info) out.push(info);
      return;
    }
    if (!n.children) return;
    for (const arr of Object.values(n.children)) {
      if (!Array.isArray(arr)) continue;
      for (const c of arr) visit(c);
    }
  };
  visit(body);
  return out;
}

function nestedTypeDecls(body: CstNode | undefined): CstNode[] {
  if (!body) return [];
  const out: CstNode[] = [];
  const visit = (n: CstNode) => {
    if (n.name && NESTED_STOP.has(n.name)) return;
    if (n.name && TYPE_NODE.has(n.name)) {
      out.push(n);
      return;
    }
    if (!n.children) return;
    for (const arr of Object.values(n.children)) {
      if (!Array.isArray(arr)) continue;
      for (const c of arr) visit(c);
    }
  };
  visit(body);
  return out;
}

type TypeInfo = {
  kind: string;
  name: string;
  body?: CstNode;
  modifiers: string[];
  annotationText: string;
};

function typeNameAndBody(decl: CstNode): TypeInfo | null {
  const outerMods = typeModifiers(decl);
  const outerAnno = annotationTextFromDecl(decl);

  const enumDecl = first(decl, "enumDeclaration") ?? (decl.name === "enumDeclaration" ? decl : undefined);
  if (enumDecl && (first(enumDecl, "typeIdentifier") || enumDecl.name === "enumDeclaration")) {
    const name = identifierImage(first(enumDecl, "typeIdentifier"));
    if (name) {
      return {
        kind: "enum",
        name,
        body: first(enumDecl, "enumBody"),
        modifiers: outerMods.length ? outerMods : typeModifiers(enumDecl),
        annotationText: `${outerAnno} ${annotationTextFromDecl(enumDecl)}`,
      };
    }
  }

  const recDecl = first(decl, "recordDeclaration") ?? (decl.name === "recordDeclaration" ? decl : undefined);
  if (recDecl && (first(recDecl, "typeIdentifier") || recDecl.name === "recordDeclaration")) {
    const name = identifierImage(first(recDecl, "typeIdentifier"));
    if (name) {
      return {
        kind: "record",
        name,
        body: first(recDecl, "recordBody"),
        modifiers: outerMods.length ? outerMods : typeModifiers(recDecl),
        annotationText: `${outerAnno} ${annotationTextFromDecl(recDecl)}`,
      };
    }
  }

  const annoDecl =
    first(decl, "annotationInterfaceDeclaration") ??
    first(decl, "annotationTypeDeclaration") ??
    (decl.name === "annotationInterfaceDeclaration" || decl.name === "annotationTypeDeclaration" ? decl : undefined);
  if (annoDecl) {
    const name = identifierImage(first(annoDecl, "typeIdentifier"));
    if (name) {
      return {
        kind: "annotation",
        name,
        body: first(annoDecl, "annotationInterfaceBody") ?? first(annoDecl, "annotationTypeBody"),
        modifiers: outerMods.length ? outerMods : typeModifiers(annoDecl),
        annotationText: `${outerAnno} ${annotationTextFromDecl(annoDecl)}`,
      };
    }
  }

  if (first(decl, "normalInterfaceDeclaration") || first(decl, "interfaceDeclaration") || decl.name === "interfaceDeclaration") {
    const inner = first(decl, "interfaceDeclaration") ?? decl;
    const normal = first(inner, "normalInterfaceDeclaration") ?? inner;
    if (!first(inner, "annotationInterfaceDeclaration")) {
      const name = identifierImage(first(normal, "typeIdentifier"));
      if (name) {
        return {
          kind: "interface",
          name,
          body: first(normal, "interfaceBody"),
          modifiers: outerMods.length ? outerMods : typeModifiers(inner),
          annotationText: `${outerAnno} ${annotationTextFromDecl(inner)}`,
        };
      }
    }
  }

  if (first(decl, "normalClassDeclaration") || decl.name === "classDeclaration" || decl.name === "normalClassDeclaration") {
    const inner = first(decl, "classDeclaration") ?? decl;
    const normal = first(inner, "normalClassDeclaration") ?? first(decl, "normalClassDeclaration");
    if (normal) {
      const name = identifierImage(first(normal, "typeIdentifier"));
      if (name) {
        return {
          kind: "class",
          name,
          body: first(normal, "classBody"),
          modifiers: outerMods.length ? outerMods : typeModifiers(inner),
          annotationText: `${outerAnno} ${annotationTextFromDecl(inner)}`,
        };
      }
    }
  }

  return null;
}

function walkType(
  decl: CstNode,
  pkg: string,
  outerNames: string[],
  fileHint?: string,
): LoaderClassRecord[] {
  const info = typeNameAndBody(decl);
  if (!info) return [];
  const names = [...outerNames, info.name];
  const binary = names.join("$");
  const fqcn = pkg ? `${pkg}.${binary}` : binary;
  const recParams = info.kind === "record" ? recordComponents(decl) : [];
  let methods = collectMethods(info.body, info.name, recParams);
  if (info.kind === "record" && recParams.length && !methods.some((m) => m.name === info.name)) {
    methods = [
      {
        name: info.name,
        returnType: info.name,
        parameters: recParams,
        modifiers: ["public"],
        signature: `${info.name}(${recParams.map((p) => p.type).join(", ")})`,
      },
      ...methods,
    ];
  }
  const flags = flagsFromAnnotations(info.annotationText);
  const rec: LoaderClassRecord = {
    fqcn,
    simpleName: info.name,
    pkg: pkg || undefined,
    modifiers: info.modifiers,
    apiStatusInternal: flags.apiStatusInternal,
    environment: flags.environment,
    methods,
    file: repoSafeSourcePath(fileHint),
  };
  const nested: LoaderClassRecord[] = [rec];
  for (const n of nestedTypeDecls(info.body)) {
    nested.push(...walkType(n, pkg, names, fileHint));
  }
  return nested;
}

function topLevelDecls(unit: CstNode): CstNode[] {
  const out: CstNode[] = [];
  for (const td of kids(unit, "typeDeclaration")) {
    for (const k of [
      "classDeclaration",
      "interfaceDeclaration",
      "enumDeclaration",
      "recordDeclaration",
      "annotationTypeDeclaration",
      "annotationInterfaceDeclaration",
    ]) {
      out.push(...kids(td, k));
    }
  }
  return out;
}

/** 摘要里只保留相对 .java 路径，禁止本机盘符 / cache 绝对路径入库。 */
export function repoSafeSourcePath(fileHint?: string): string | undefined {
  if (!fileHint) return undefined;
  const n = fileHint.replace(/\\/g, "/");
  const marker = "loader-api-src/";
  const idx = n.toLowerCase().lastIndexOf(marker);
  if (idx >= 0) {
    const rest = n.slice(idx + marker.length);
    const slash = rest.indexOf("/");
    return slash >= 0 ? rest.slice(slash + 1) : rest;
  }
  const pkg = n.match(/\/((?:net|org|com|cpw)\/.+\.java)$/i);
  if (pkg) return pkg[1];
  if (/^[A-Za-z]:\//.test(n) || n.startsWith("/") || n.startsWith("//")) {
    const base = n.split("/").pop();
    return base && base.endsWith(".java") ? base : undefined;
  }
  return n;
}

/** 从源码路径推出 FQCN；解析失败时禁止把盘符路径写进 fqcn。 */
export function fqcnFromSourceHint(fileHint?: string): string | undefined {
  if (!fileHint) return undefined;
  const n = fileHint.replace(/\\/g, "/");
  const m = n.match(/\/((?:net|org|com|cpw)\/.+)\.java$/i);
  if (m) return m[1].replace(/\//g, ".");
  const safe = repoSafeSourcePath(fileHint);
  if (safe && safe.endsWith(".java") && !/^[A-Za-z]:/.test(safe) && !safe.includes("mc-skill-temp")) {
    return safe.replace(/\.java$/i, "").replace(/\//g, ".");
  }
  return undefined;
}

export function isThinLoaderSummary(prev: Pick<LoaderApiSummary, "classes" | "fqcnIndex" | "classCount">): boolean {
  const classes = prev.classes ?? [];
  if (!classes.length) return true;
  if (classes.some((c) => Array.isArray(c.methods) && c.methods.some((m) => typeof m === "string"))) {
    return true;
  }
  const indexLen = (prev.fqcnIndex ?? []).length;
  if (classes.length === 400 && indexLen > 400) return true;
  if (typeof prev.classCount === "number" && prev.classCount > classes.length + 10) return true;
  if (indexLen > 0 && classes.length < indexLen * 0.5) return true;
  return false;
}

export function extractCompilationUnit(javaText: string, fileHint?: string): LoaderClassRecord[] {
  let cst: CstNode;
  try {
    cst = parse(javaText) as CstNode;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return [
      {
        fqcn: fqcnFromSourceHint(fileHint) ?? "unknown",
        simpleName: "unknown",
        apiStatusInternal: false,
        environment: false,
        methods: [],
        parseError: String(msg)
          .replace(/[A-Za-z]:[\\/][^\s"']+/g, "[redacted-path]")
          .replace(/mc-skill-temp[^\s"']*/gi, "[redacted-path]"),
        file: repoSafeSourcePath(fileHint),
      },
    ];
  }
  const unit = first(cst, "ordinaryCompilationUnit") ?? cst;
  const pkg = packageName(unit);
  const decls = topLevelDecls(unit);
  if (decls.length === 0) return [];
  const out: LoaderClassRecord[] = [];
  for (const d of decls) {
    out.push(...walkType(d, pkg, [], fileHint));
  }
  return out;
}
