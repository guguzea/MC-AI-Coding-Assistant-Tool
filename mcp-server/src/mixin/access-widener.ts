/**
 * T4 Access Widener / Class Tweaker（Fabric `.accesswidener` 与 `.classtweaker`）解析与字节码级校验。
 *
 * 头（两种规范，都必须能解析；出处逐条可开）：
 *   accessWidener v1|v2 <namespace>   —— 旧名文件
 *   classTweaker  v1 <namespace>      —— fabric_1.21.11/…/processed/develop_class-tweakers_index.md:32
 *                                        与 fabric_1.21.11/reference/1.21.11/src/main/resources/example-mod.classtweaker:1
 *   classTweaker  v2 <namespace>      —— fabric_26.1.2/reference/26.1.2/src/main/resources/example-mod.classtweaker:1
 *   namespace ∈ named|intermediary|official；元素「任意空白分隔，含 tab」index.md:39-40；
 *   可用性条件（Loader 0.18.0+ / Loom 1.12+，且只可指向 Vanilla 类）index.md:16,61
 *
 * 指令（五族，出处全在 26.1.2 的 class-tweakers 三页）：
 *   accessible / extendable / mutable —— 后跟 class|method|field [+ member + descriptor]
 *   inject-interface <targetClassName> <injectedInterfaceName>   （interface-injection.md:71；内部名 :74；
 *                                                                  带泛型的实例见 reference/26.1.2/…/example-mod.classtweaker:32）
 *   extend-enum      <targetClassName> <ENUM_CONSTANT_NAME>       （enum-extension.md:92；内部名 :95；
 *                                                                  **本指令要求头是 v2** + Loom 1.16+ = :87）
 *   五族都可加 `transitive-` 前缀（index.md:48,53,56）
 *
 * 校验核心与 AT 同框架（继承成员 / record 组件 / 内部类可达性 / 跨文件冲突），
 * 另加 Fabric 语义：transitive 前缀与 namespace 合法性。
 *   （不校验「extendable 目标必须/不得为 final」：AW 的 extendable 正是用来放开 final 的指令，
 *    见 fabric_26.1.2 develop_class-tweakers_access-widening.md:61-68；全仓 forge 语料无 extendable-final 写法。）
 *   （也不校验「被注入接口的方法必须全是 default」：那是**用户自己的接口类**的形状，不在客户端 jar 里，
 *    本工具无从核对；文档条件见 interface-injection.md:38。）
 */

import type { JarIndex } from "./bytecode.js";
import {
  normalizeOwnerCandidates,
  ownersMatch,
  lookupMemberInHierarchy,
  isObfuscatedName,
  mappingMismatchSuggestion,
  type AccessValidationError,
  type AccessConflict,
  type AccessValidationResult,
} from "./access-transformer.js";

export { type AccessValidationError, type AccessConflict, type AccessValidationResult };

const AW_TYPE_RE = /^(accessible|extendable|mutable)$/;
const AW_NAMESPACES = ["named", "intermediary", "official"];
/** 两族「非 access」指令：都是 `<目标内部名> <第二个操作数>`，没有 class|method|field 关键字。 */
const AW_TWO_OPERAND_DIRECTIVES = ["inject-interface", "extend-enum"] as const;
type TwoOperandDirective = (typeof AW_TWO_OPERAND_DIRECTIVES)[number];

export type AwSpec = "accessWidener" | "classTweaker";

export interface AccessWidenerEntry {
  type: "accessible" | "extendable" | "mutable" | TwoOperandDirective;
  owner: string;
  member?: string;
  descriptor?: string;
  /** inject-interface 的被注入接口内部名 / extend-enum 的枚举常量名（两操作数指令专用） */
  operand?: string;
  kind: "class" | "member";
  transitive: boolean;
  raw: string;
  lineNo: number;
}

export function parseAccessWidener(
  content: string,
): { entries: AccessWidenerEntry[]; errors: AccessValidationError[]; warnings: string[]; namespace?: string; version?: number; spec?: "accessWidener" | "classTweaker" } {
  const entries: AccessWidenerEntry[] = [];
  const errors: AccessValidationError[] = [];
  const warnings: string[] = [];
  let namespace: string | undefined;
  let version: number | undefined;
  let spec: "accessWidener" | "classTweaker" | undefined;
  let headerSeen = false;

  const lines = content.split(/\r?\n/);
  for (let idx = 0; idx < lines.length; idx++) {
    const lineNo = idx + 1;
    const line = lines[idx].split("#")[0].trim();
    if (!line) continue;

    if (!headerSeen) {
      // 两种规范的头：`accessWidener v1|v2 <ns>` 与 `classTweaker v<n> <ns>`。
      // classTweaker 的版本号**不收枚举**：v1 见 1.21.11 文档正文与其参考工程，v2 见
      // fabric_26.1.2/reference/26.1.2/src/main/resources/example-mod.classtweaker:1，
      // 而 index.md:34 明写「Some features may require a version higher than v1」⇒ 上游会长版本。
      // 认不出的号按已知规则集解析 + 一条披露，别把合法新头判成红（这正是上一轮 classTweaker 头的病）。
      const m = line.match(/^(?:accessWidener\s+v([12])|classTweaker\s+v(\d+))\s+(\S+)$/);
      if (!m) {
        errors.push({
          target: line,
          issue: `首行应为 accessWidener / classTweaker header（第 ${lineNo} 行）`,
          suggestion: "格式：accessWidener v2 <namespace> 或 classTweaker v1 <namespace>，namespace ∈ named / intermediary / official",
        });
        continue;
      }
      headerSeen = true;
      spec = m[1] ? "accessWidener" : "classTweaker";
      version = Number(m[1] ?? m[2]);
      namespace = m[3];
      if (!AW_NAMESPACES.includes(namespace)) {
        warnings.push(`namespace「${namespace}」不是标准值（named / intermediary / official），按字面处理`);
      }
      if (spec === "classTweaker" && version > 2) {
        warnings.push(
          `classTweaker v${version}：本解析器只核到 v1/v2 的语法（v1 = develop_class-tweakers_index.md:32，v2 = reference/26.1.2/…/example-mod.classtweaker:1），` +
            "更高版本新增的指令可能被判「未知 AW 类型」——那不是文件坏了，是本工具规则集过期",
        );
      }
      continue;
    }

    let tokens = line.split(/\s+/);
    let transitive = false;
    // Fabric 官方 v2 连字形式：transitive-accessible / transitive-extendable / transitive-mutable
    // （fabric-loader AccessWidenerReader 按 startsWith("transitive-") 解析，F-E103）
    if (tokens[0] === "transitive") {
      transitive = true;
      tokens = tokens.slice(1);
      if (version === 1 && spec !== "classTweaker") {
        warnings.push(`第 ${lineNo} 行：transitive 仅在 accessWidener v2 支持（当前 v1）`);
      }
    } else if (tokens[0]?.startsWith("transitive-")) {
      transitive = true;
      tokens = [tokens[0].slice("transitive-".length), ...tokens.slice(1)];
      if (version === 1 && spec !== "classTweaker") {
        warnings.push(`第 ${lineNo} 行：transitive 仅在 accessWidener v2 支持（当前 v1）`);
      }
    }
    // ── 两操作数指令：inject-interface / extend-enum（后面没有 class|method|field 关键字）──
    const twoOp = AW_TWO_OPERAND_DIRECTIVES.find((d) => d === tokens[0]);
    if (twoOp) {
      const second = twoOp === "inject-interface" ? "<injectedInterfaceName>" : "<ENUM_CONSTANT_NAME>";
      const rest = tokens.slice(1);
      if (rest.length < 2) {
        errors.push({
          target: line,
          issue: `${twoOp} 条目需要两个元素：<targetClassName> ${second}（第 ${lineNo} 行）`,
          suggestion:
            twoOp === "inject-interface"
              ? "语法出处 develop_class-tweakers_interface-injection.md:71，两者都用内部名（:74）：inject-interface net/minecraft/world/level/material/FlowingFluid com/example/docs/interface_injection/BucketEmptySoundGetter"
              : "语法出处 develop_class-tweakers_enum-extension.md:92，目标用内部名（:95）：extend-enum net/minecraft/world/inventory/RecipeBookType EXAMPLE_MOD_RECIPE_BOOK_TYPE",
        });
        continue;
      }
      if (rest.length > 2) warnings.push(`第 ${lineNo} 行：${twoOp} 只吃两个元素，多余部分忽略: ${line}`);
      const owner = rest[0];
      const operand = rest[1];
      if (twoOp === "extend-enum" && (version ?? 1) < 2) {
        errors.push({
          target: line,
          issue: `extend-enum 要求文件头是 v2（当前 v${version ?? 1}，第 ${lineNo} 行）`,
          suggestion:
            "出处 develop_class-tweakers_enum-extension.md:87（「set the file header version to `v2`」，另需 Loom 1.16+）⇒ 头改成 classTweaker v2 <namespace>",
        });
        continue;
      }
      const gen = genericsIssue(operand);
      if (gen) {
        errors.push({
          target: line,
          issue: `${twoOp} 的第二个元素泛型形状不合法（${gen}，第 ${lineNo} 行）`,
          suggestion:
            "带泛型时在名字尾部加 <…>，内容按 Java 字节码签名格式（interface-injection.md:82-95 的表）：" +
            "com/example/docs/interface_injection/GenericInterface<+Ljava/lang/String;[Ljava/lang/Boolean;>",
        });
        continue;
      }
      if (spec === "accessWidener") {
        warnings.push(
          `第 ${lineNo} 行：${twoOp} 在文档里属 class tweaker 面（develop_class-tweakers_index.md:48,53,56），` +
            "当前头是旧名 accessWidener ⇒ loader 是否接受这一组合本仓语料未取证，只提示不判红",
        );
      }
      for (const [role, name] of [
        ["<targetClassName>", owner],
        [second, operand],
      ] as const) {
        if (twoOp === "extend-enum" && role === second) continue; // 枚举常量名按语法就是个大写常量，不含包名
        if (name && /\./.test(name)) {
          warnings.push(
            `第 ${lineNo} 行：${role}「${name}」含点号 —— class tweaking 的类与接口用内部名（斜杠分隔，interface-injection.md:74 / enum-extension.md:95），` +
              "像是把 FQCN 抄进来了",
          );
        }
      }
      entries.push({ type: twoOp, owner, operand, kind: "class", transitive, raw: line, lineNo });
      continue;
    }
    const types: AccessWidenerEntry["type"][] = [];
    while (tokens.length > 0 && AW_TYPE_RE.test(tokens[0])) {
      types.push(tokens[0] as AccessWidenerEntry["type"]);
      tokens = tokens.slice(1);
    }
    if (types.length === 0) {
      errors.push({
        target: line,
        issue: `未知 AW 类型「${line.split(/\s+/)[0] ?? ""}」（第 ${lineNo} 行）`,
        suggestion: "AW 类型应为 accessible / extendable / mutable（可并列，如 accessible extendable class）",
      });
      continue;
    }
    if (tokens.length < 2) {
      errors.push({
        target: line,
        issue: `无法解析 AW 条目（第 ${lineNo} 行）`,
        suggestion: "格式：[transitive ]<accessible|extendable|mutable>… <class|method|field> <owner> [<member> <descriptor>]",
      });
      continue;
    }
    const kindToken = tokens[0];
    if (!/^(class|method|field)$/.test(kindToken)) {
      errors.push({
        target: line,
        issue: `未知成员种类「${kindToken}」（第 ${lineNo} 行）`,
        suggestion: "AW 条目在 access 关键字之后应为 class / method / field",
      });
      continue;
    }
    if (tokens.length > 4) {
      warnings.push(`第 ${lineNo} 行 token 过多，多余部分忽略: ${line}`);
    }
    for (const type of types) {
      entries.push({
        type,
        owner: tokens[1],
        member: kindToken === "class" ? undefined : tokens[2],
        descriptor: kindToken === "class" ? undefined : tokens[3],
        kind: kindToken === "class" || tokens[2] === undefined ? "class" : "member",
        transitive,
        raw: line,
        lineNo,
      });
    }
  }
  if (!headerSeen) {
    errors.push({ target: "(header)", issue: "缺少 accessWidener / classTweaker header", suggestion: "首行应为：accessWidener v2 <namespace> 或 classTweaker v1 <namespace>" });
  }
  return { entries, errors, warnings, namespace, version, spec };
}

/**
 * 只校泛型的**尖括号形状**（`Name<sig>` / 可嵌套 `Ljava/util/List<TT;>;`）。
 * 泛型内容本身的字节码签名结构不解析 —— 上游格式表在 interface-injection.md:82-95，
 * 这里重造一个签名解析器只会造出一个没人维护的第二真值。
 */
function genericsIssue(name: string): string | null {
  const first = name.indexOf("<");
  if (first < 0) return null;
  if (first === 0) return "泛型前必须有接口内部名";
  if (!name.endsWith(">")) return "缺尾部 `>`";
  let depth = 0;
  for (const c of name) {
    if (c === "<") depth++;
    else if (c === ">") {
      depth--;
      if (depth < 0) return "`>` 多于 `<`";
    }
  }
  if (depth !== 0) return "`<` 与 `>` 数量不配对";
  if (name.slice(first + 1, name.length - 1).trim() === "") return "泛型内容为空";
  return null;
}

export interface AwValidateOptions {
  mapping?: string;
}

export function validateAccessWidener(
  content: string,
  index: JarIndex,
  opts: AwValidateOptions = {},
): AccessValidationResult {
  const parsed = parseAccessWidener(content);
  const errors = [...parsed.errors];
  const warnings = [...parsed.warnings];
  const checkedMembers = parsed.entries.filter((e) => e.kind === "member").length;
  validateWidenerEntries(parsed.entries, index, opts, errors, warnings);
  return { valid: errors.length === 0, errors, warnings, checkedMembers, crossFileConflicts: [] };
}

export function validateAccessWidenerFiles(
  contents: string[],
  index: JarIndex,
  opts: AwValidateOptions = {},
): AccessValidationResult {
  const errors: AccessValidationError[] = [];
  const warnings: string[] = [];
  // S12/T4 补丁（第 21 轮）：`fileNo` 标记条目来自 `contents[]` 的第几段。
  // 「同行并列多修饰符」是**同一段**里的两个面（可跳过），而两段各自第 2 行的同名条目
  // 行号也相同、却是两条真规则（必须报红）。只按 lineNo 跳过会把跨文件真冲突一起吞掉
  // （实测 `test-deep-mixin.mjs:457` 「跨 AW 冲突应被检出」在第 21 轮前为红）。
  const allEntries: Array<AccessWidenerEntry & { fileNo?: number }> = [];
  let checkedMembers = 0;
  contents.forEach((content, fileNo) => {
    const parsed = parseAccessWidener(content);
    errors.push(...parsed.errors);
    warnings.push(...parsed.warnings);
    for (const e of parsed.entries) {
      allEntries.push({ ...e, fileNo });
      if (e.kind === "member") checkedMembers++;
    }
  });
  validateWidenerEntries(allEntries, index, opts, errors, warnings);
  const { conflicts, warnings: conflictWarnings } = detectWidenerConflicts(allEntries);
  warnings.push(...conflictWarnings);
  return { valid: errors.length === 0, errors, warnings, checkedMembers, crossFileConflicts: conflicts };
}

function validateWidenerEntries(
  entries: AccessWidenerEntry[],
  index: JarIndex,
  opts: AwValidateOptions,
  errors: AccessValidationError[],
  warnings: string[],
): void {
  for (const e of entries) {
    const owners = normalizeOwnerCandidates(e.owner);
    const ownerHit = owners.find((o) => index.hasClass(o));
    if (!ownerHit) {
      errors.push({
        target: e.owner,
        issue: `类不存在于 jar${e.kind === "member" ? `（成员 ${e.member}）` : ""}`,
        suggestion: owners.length > 1
          ? "检查内部类写法（Outer$Inner）与包路径；若使用映射名，请先 convert_mapping 确认类名"
          : "检查包路径/类名拼写；若使用映射名，请先 convert_mapping 确认类名",
      });
      continue;
    }
    if (e.type === "mutable" && e.kind === "member" && e.member?.includes("(")) {
      warnings.push(`mutable 通常用于字段；${e.member} 看起来是方法`);
    }
    if (e.kind === "class") continue;

    const lookup = lookupMemberInHierarchy(index, ownerHit, e.member!, e.descriptor);
    if (!lookup.found) {
      if (isObfuscatedName(e.member!)) {
        errors.push({
          target: `${e.owner}#${e.member}`,
          issue: `成员不存在：${e.member}（可能是映射层不匹配）`,
          suggestion: mappingMismatchSuggestion(e.member!, opts.mapping),
        });
      } else {
        errors.push({
          target: `${e.owner}#${e.member}${e.descriptor ? " " + e.descriptor : ""}`,
          issue: `成员不存在于 ${ownerHit} 或其父类链`,
          suggestion: "检查成员名拼写与 MC 版本；映射名请用 convert_mapping 转换",
        });
      }
      continue;
    }
    if (lookup.declaredIn && lookup.declaredIn !== ownerHit) {
      warnings.push(`成员 ${e.member} 声明于父类 ${lookup.declaredIn}（经 ${ownerHit} 继承可达）`);
    }
  }
}

function detectWidenerConflicts(
  entries: Array<AccessWidenerEntry & { fileNo?: number }>,
): { conflicts: AccessConflict[]; warnings: string[] } {
  const groups: Array<Array<AccessWidenerEntry & { fileNo?: number }>> = [];
  for (const e of entries) {
    const hit = groups.find((g) => {
      const s = g[0];
      if (s.kind !== e.kind) return false;
      if ((s.member ?? "") !== (e.member ?? "")) return false;
      if ((s.descriptor ?? "") !== (e.descriptor ?? "")) return false;
      // 同一个目标类**注入两个接口**是合法的（interface-injection.md:71 的条目按接口一条一行），
      // 所以第二个操作数必须进分组键，否则两条合法注入会被报成「重复声明」。
      if ((s.operand ?? "") !== (e.operand ?? "")) return false;
      return ownersMatch(s.owner, e.owner);
    });
    if (hit) hit.push(e);
    else groups.push([e]);
  }
  const conflicts: AccessConflict[] = [];
  const warnings: string[] = [];
  for (const list of groups) {
    if (list.length < 2) continue;
    const first = list[0];
    const target = first.kind === "class"
      ? first.owner
      : `${first.owner}#${first.member}${first.descriptor ?? ""}`;
    const firstTransitive = first.transitive;
    for (const e of list.slice(1)) {
      // S12/T4：同一行本来就允许并列多个修饰符 —— AW 的 `accessible extendable class Foo`
      // 会被解析成两条 kind/owner 相同、type 不同（accessible / extendable）的条目，
      // 那是一行的两个面，不是两条互相矛盾的规则。旧实现只按 kind+owner+member+descriptor 分组，
      // 于是合法单行被判 access 冲突。
      // ⚠️ 但「同 lineNo」不足以判定同一条目：`contents[]` 的两段（splitWidenerFiles 的多文件段，
      // 或两个 AW 文件）各自的第 2 行行号相同，那是**两条真规则**，必须仍报红。
      // ⇒ 判据是「同段 + 同行」，缺 fileNo 时按同段（0）处理以保持旧调用形状可用。
      if (e.lineNo === first.lineNo && (e.fileNo ?? 0) === (first.fileNo ?? 0)) continue;
      if (e.type !== first.type) {
        conflicts.push({ target, accessA: first.type, accessB: e.type });
      } else if (e.transitive !== firstTransitive) {
        warnings.push(`同一目标 ${target} 的 transitive 标记不一致（transitive 冲突需人工确认）`);
      } else {
        warnings.push(`重复声明（相同类型）：${target}（第 ${e.lineNo} 行）`);
      }
    }
  }
  return { conflicts, warnings };
}

/** 单一 content 内 `# ==== file: 名字 ====` 注释行作为文件边界，用于跨文件冲突检测。后续段若缺 header 则继承第一段。 */
export function splitWidenerFiles(content: string): string[] {
  const segments = content.split(/^#\s*={3,}.*$/gm).map((s) => s.trim()).filter((s) => s.length > 0);
  if (segments.length <= 1) return segments;
  // 两种头都要继承：只认 accessWidener 会让 classTweaker 多段文件从第二段起「缺 header」（同一族缺陷）。
  const headerMatch = segments[0].match(/^(?:accessWidener|classTweaker)\s+\S+\s+\S+/m);
  const header = headerMatch?.[0];
  if (!header) return segments;
  return segments.map((s, i) => {
    if (i === 0) return s;
    if (/^(?:accessWidener|classTweaker)\s/m.test(s)) return s;
    return `${header}\n${s}`;
  });
}
