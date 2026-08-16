/**
 * 用 java-parser（Chevrotain CST）抽取具名类型与方法签名。
 * 禁止用正则当签名源；解析失败记 parseError，不回退正则。
 * 本模块较重，禁止被 query_loader_api 静态导入（ingest / 抽取脚本动态或脚本入口加载）。
 */
import { parse } from "java-parser";
import type { LoaderClassRecord, MethodInfo } from "./types.js";

interface CstNode {
  name?: string;
  image?: string;
  startOffset?: number;
  children?: Record<string, CstNode[] | undefined>;
}

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
  const img = cstImage(node);
  return img;
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
      if (img) out.push(img);
    }
  }
  return out.filter((m) => m && !m.startsWith("@"));
}

function methodModifiers(method: CstNode): string[] {
  const out: string[] = [];
  for (const key of ["methodModifier", "interfaceMethodModifier"]) {
    for (const m of kids(method, key)) {
      const img = cstImage(m).trim();
      if (img) out.push(img);
    }
  }
  return out.filter((m) => m && !m.startsWith("@"));
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

function methodsFromBody(body: CstNode | undefined): MethodInfo[] {
  if (!body) return [];
  const out: MethodInfo[] = [];
  const memberKeys = [
    "classBodyDeclaration",
    "interfaceMemberDeclaration",
    "enumBodyDeclaration",
    "recordBodyDeclaration",
    "annotationTypeMemberDeclaration",
  ];
  const walkMember = (member: CstNode) => {
    const method =
      first(member, "methodDeclaration") ??
      first(member, "interfaceMethodDeclaration") ??
      first(first(member, "classMemberDeclaration"), "methodDeclaration") ??
      first(first(member, "interfaceMemberDeclaration"), "interfaceMethodDeclaration");
    if (method) {
      const info = extractMethod(method);
      if (info) out.push(info);
    }
  };
  for (const key of memberKeys) {
    for (const decl of kids(body, key)) walkMember(decl);
  }
  return out;
}

function nestedTypeDecls(body: CstNode | undefined): CstNode[] {
  if (!body) return [];
  const out: CstNode[] = [];
  const wrapKeys = [
    "classBodyDeclaration",
    "interfaceMemberDeclaration",
    "enumBodyDeclaration",
    "recordBodyDeclaration",
  ];
  for (const key of wrapKeys) {
    for (const wrap of kids(body, key)) {
      const member =
        first(wrap, "classMemberDeclaration") ??
        first(wrap, "interfaceMemberDeclaration") ??
        wrap;
      for (const tkey of ["classDeclaration", "interfaceDeclaration", "enumDeclaration", "recordDeclaration", "annotationTypeDeclaration"]) {
        out.push(...kids(member, tkey), ...kids(wrap, tkey));
      }
    }
  }
  return out;
}

function typeNameAndBody(decl: CstNode): { kind: string; name: string; body?: CstNode; modifiers: string[] } | null {
  const modifiers = typeModifiers(decl);
  const tryNormal = (
    wrapperKey: string,
    normalKey: string,
    bodyKey: string,
    kind: string,
  ): ReturnType<typeof typeNameAndBody> => {
    const wrapper = wrapperKey ? first(decl, wrapperKey) ?? decl : decl;
    const normal = first(wrapper, normalKey) ?? first(decl, normalKey) ?? wrapper;
    const ident = first(normal, "typeIdentifier") ?? first(wrapper, "typeIdentifier") ?? first(decl, "typeIdentifier");
    const name = identifierImage(ident);
    if (!name) return null;
    const body = first(normal, bodyKey) ?? first(wrapper, bodyKey) ?? first(decl, bodyKey);
    return { kind, name, body, modifiers: modifiers.length ? modifiers : typeModifiers(wrapper) };
  };

  if (first(decl, "normalClassDeclaration") || first(decl, "classDeclaration") || decl.name === "classDeclaration") {
    const inner = first(decl, "classDeclaration") ?? decl;
    return tryNormal("", "normalClassDeclaration", "classBody", "class") ?? tryNormal("", "normalClassDeclaration", "classBody", "class") ?? (() => {
      const ident = first(first(inner, "normalClassDeclaration"), "typeIdentifier");
      const name = identifierImage(ident);
      if (!name) return null;
      return {
        kind: "class",
        name,
        body: first(first(inner, "normalClassDeclaration"), "classBody"),
        modifiers: typeModifiers(inner),
      };
    })();
  }
  if (first(decl, "normalInterfaceDeclaration") || first(decl, "interfaceDeclaration") || decl.name === "interfaceDeclaration") {
    const inner = first(decl, "interfaceDeclaration") ?? decl;
    const normal = first(inner, "normalInterfaceDeclaration") ?? inner;
    const name = identifierImage(first(normal, "typeIdentifier"));
    if (!name) return null;
    return { kind: "interface", name, body: first(normal, "interfaceBody"), modifiers: typeModifiers(inner) };
  }
  if (first(decl, "enumDeclaration") || decl.name === "enumDeclaration") {
    const inner = first(decl, "enumDeclaration") ?? decl;
    const name = identifierImage(first(inner, "typeIdentifier"));
    if (!name) return null;
    return { kind: "enum", name, body: first(inner, "enumBody"), modifiers: typeModifiers(inner) };
  }
  if (first(decl, "recordDeclaration") || decl.name === "recordDeclaration") {
    const inner = first(decl, "recordDeclaration") ?? decl;
    const name = identifierImage(first(inner, "typeIdentifier"));
    if (!name) return null;
    return { kind: "record", name, body: first(inner, "recordBody"), modifiers: typeModifiers(inner) };
  }
  if (first(decl, "annotationTypeDeclaration") || decl.name === "annotationTypeDeclaration") {
    const inner = first(decl, "annotationTypeDeclaration") ?? decl;
    const name = identifierImage(first(inner, "typeIdentifier"));
    if (!name) return null;
    return { kind: "annotation", name, body: first(inner, "annotationTypeBody"), modifiers: typeModifiers(inner) };
  }
  return null;
}

function walkType(
  decl: CstNode,
  pkg: string,
  outerNames: string[],
  sourceText: string,
  fileHint?: string,
): LoaderClassRecord[] {
  const info = typeNameAndBody(decl);
  if (!info) return [];
  const names = [...outerNames, info.name];
  const binary = names.join("$");
  const fqcn = pkg ? `${pkg}.${binary}` : binary;
  const methods = methodsFromBody(info.body);
  const rec: LoaderClassRecord = {
    fqcn,
    simpleName: info.name,
    pkg: pkg || undefined,
    modifiers: info.modifiers,
    apiStatusInternal: /@ApiStatus\.Internal\b/.test(sourceText),
    environment: /@Environment\b|@OnlyIn\b/.test(sourceText),
    methods,
    file: fileHint,
  };
  const nested: LoaderClassRecord[] = [rec];
  for (const n of nestedTypeDecls(info.body)) {
    nested.push(...walkType(n, pkg, names, sourceText, fileHint));
  }
  return nested;
}

function topLevelDecls(unit: CstNode): CstNode[] {
  const out: CstNode[] = [];
  for (const td of kids(unit, "typeDeclaration")) {
    for (const k of ["classDeclaration", "interfaceDeclaration", "enumDeclaration", "recordDeclaration", "annotationTypeDeclaration"]) {
      out.push(...kids(td, k));
    }
  }
  return out;
}

export function extractCompilationUnit(javaText: string, fileHint?: string): LoaderClassRecord[] {
  let cst: CstNode;
  try {
    cst = parse(javaText) as CstNode;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return [
      {
        fqcn: fileHint ?? "unknown",
        simpleName: "unknown",
        apiStatusInternal: false,
        environment: false,
        methods: [],
        parseError: msg,
        file: fileHint,
      },
    ];
  }
  const unit = first(cst, "ordinaryCompilationUnit") ?? cst;
  const pkg = packageName(unit);
  const decls = topLevelDecls(unit);
  if (decls.length === 0) return [];
  const out: LoaderClassRecord[] = [];
  for (const d of decls) {
    out.push(...walkType(d, pkg, [], javaText, fileHint));
  }
  return out;
}
