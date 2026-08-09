import { mergeInjectMethodAndDesc, parseMethodArrayLiteral, parseMethodReference, type ParsedMethodRef } from "./method-string.js";

export interface MixinClassRef {
  className: string;
  target?: string;
  file?: string;
}

export interface InjectionSite {
  kind: "Inject" | "Redirect" | "ModifyVariable" | "Overwrite" | "Accessor" | "Invoker" | "Unknown";
  methodRefs: ParsedMethodRef[];
  at?: string;
  lineHint?: number;
}

export interface ParsedMixinSource {
  mixinClass: string;
  targetClass?: string;
  injections: InjectionSite[];
}

export interface MixinsJsonSummary {
  package?: string;
  mixinClasses: string[];
  client: string[];
  server: string[];
  warnings: string[];
}

export function parseMixinsJson(content: string): MixinsJsonSummary {
  const warnings: string[] = [];
  const mixinClasses = new Set<string>();
  const client: string[] = [];
  const server: string[] = [];
  let pkg: string | undefined;

  let config: Record<string, unknown>;
  try {
    config = JSON.parse(content) as Record<string, unknown>;
  } catch {
    return { mixinClasses: [], client: [], server: [], warnings: ["mixins.json JSON 解析失败"] };
  }

  if (typeof config.package === "string") pkg = config.package;

  const collect = (arr: unknown, bucket: string[]) => {
    if (!Array.isArray(arr)) return;
    for (const m of arr) {
      if (typeof m === "string") {
        mixinClasses.add(m);
        bucket.push(m);
      } else if (typeof m === "object" && m !== null && "mixin" in m) {
        const entry = m as { mixin: string; target?: string };
        mixinClasses.add(entry.mixin);
        bucket.push(entry.mixin);
        if (entry.target?.startsWith(".")) {
          warnings.push(`mixins.json: target '${entry.target}' 应以完整类名开头`);
        }
      }
    }
  };

  collect(config.mixins, client);
  collect(config.client, client);
  collect(config.server, server);

  return {
    package: pkg,
    mixinClasses: [...mixinClasses],
    client,
    server,
    warnings,
  };
}

function extractAnnotationBlock(source: string, name: string): string[] {
  const blocks: string[] = [];
  const needle = `@${name}`;
  let i = 0;
  while ((i = source.indexOf(needle, i)) >= 0) {
    const open = source.indexOf("(", i + needle.length);
    if (open < 0) break;
    let depth = 0;
    let j = open;
    for (; j < source.length; j++) {
      const c = source[j];
      if (c === "(") depth++;
      else if (c === ")") {
        depth--;
        if (depth === 0) {
          blocks.push(source.slice(open + 1, j));
          break;
        }
      }
    }
    i = j + 1;
  }
  return blocks;
}

function parseAtValue(block: string, key: string): string | undefined {
  const re = new RegExp(`${key}\\s*=\\s*"([^"]*)"`, "s");
  const m = block.match(re);
  return m?.[1];
}

function parseMethodValue(block: string): string[] {
  const methodEq = block.match(/method\s*=\s*(\{[^}]+\}|"[^"]+")/s);
  if (!methodEq) return [];
  const val = methodEq[1].trim();
  if (val.startsWith("{")) return parseMethodArrayLiteral(val);
  if (val.startsWith('"')) return [val.slice(1, -1)];
  return [];
}

export function parseMixinJavaSource(source: string, filePath?: string): ParsedMixinSource | null {
  const classMatch = source.match(/(?:public\s+)?class\s+(\w+)/);
  if (!classMatch) return null;

  const mixinAnn = source.match(/@Mixin\s*\(\s*([^)]+)\s*\)/s);
  let targetClass: string | undefined;
  if (mixinAnn) {
    const inner = mixinAnn[1];
    const valueMatch = inner.match(/value\s*=\s*([\w.]+\.class)/);
    if (valueMatch) targetClass = valueMatch[1].replace(/\.class$/, "");
    else {
      const simple = inner.match(/([\w.]+)\.class/);
      if (simple) targetClass = simple[1];
    }
  }

  const injections: InjectionSite[] = [];
  const kinds = ["Inject", "Redirect", "ModifyVariable", "Overwrite", "Accessor", "Invoker"] as const;

  for (const kind of kinds) {
    for (const block of extractAnnotationBlock(source, kind)) {
      const at = parseAtValue(block, "at") ?? parseAtValue(block, "target");
      const desc = parseAtValue(block, "desc");
      const methods = parseMethodValue(block);
      const methodRefs: ParsedMethodRef[] = [];
      if (methods.length) {
        for (const m of methods) {
          methodRefs.push(parseMethodReference(m, desc));
        }
      } else {
        const single = parseAtValue(block, "method");
        if (single) methodRefs.push(mergeInjectMethodAndDesc(single, desc) ?? parseMethodReference(single, desc));
      }
      injections.push({
        kind,
        methodRefs,
        at,
      });
    }
  }

  return {
    mixinClass: classMatch[1],
    targetClass,
    injections,
  };
}

export function findMixinClassInFiles(
  mixinName: string,
  javaFiles: Array<{ path: string; content: string }>,
): { path: string; content: string } | undefined {
  const simple = mixinName.includes(".") ? mixinName.slice(mixinName.lastIndexOf(".") + 1) : mixinName;
  return javaFiles.find(
    (f) => f.path.replace(/\\/g, "/").endsWith(`/${simple}.java`) || f.content.includes(`class ${simple}`),
  );
}
