/**
 * S2：把一次映射查询变成可直接粘贴的 AT / AW 条目行（吸收 Linkie 的 access widener entries 面）。
 *
 * 语法与「名字层」一律取本仓已核实语料，生成后回灌自家解析器自检；
 * 缺哪一块（SRG 名 / 描述符）就在行里留 TODO，不猜名字。
 */
import {
  lookupField,
  lookupMethod,
  type FieldRow,
  type MappingDbPreference,
  type MethodRow,
} from "./yarn-sqlite.js";
import { parseAccessTransformer } from "../mixin/access-transformer.js";
import { parseAccessWidener } from "../mixin/access-widener.js";

export type AccessLineFormat = "at" | "aw";
export type AccessLoader =
  | "forge"
  | "neoforge"
  | "fabric"
  | "quilt"
  | "liteloader"
  | "rift"
  | "modloader"
  | "bedrock";

export interface AccessLineRequest {
  version: string;
  /** 只有 accessLines 这条腿消费；缺省时两种格式都给，并注明归属加载器。 */
  loader?: AccessLoader;
  memberKind: "class" | "method" | "field";
  /** 用户给的类名（点号或斜杠、任一层）；条目里的可读名就用它，不替用户换层。 */
  className?: string;
  /** 用户给的成员名（可读名或混淆名都接受）。 */
  memberName?: string;
  /** 用户原始传入的成员名（当 memberName 是转换结果时用它当可读名候选）。 */
  memberNameInput?: string;
  /** 用户给的描述符；缺省时才回落到本档映射库的 named 层。 */
  descriptor?: string;
  access?: "public" | "protected" | "private" | "default";
  /** AT 的 +f / -f 后缀（两边语料的 Access Modifiers 段）。 */
  finalOp?: "add" | "remove";
  /** 本次转换的目标层：决定 AW 头里的 namespace（named / intermediary / official）。转换未命中时不要传（名字层未确认）。 */
  toLayer?: "mojang" | "mcp" | "yarn" | "parchment" | "obfuscated" | "intermediary";
}

export interface AccessLineEntry {
  format: AccessLineFormat;
  /** 完整条目行；含 `<TODO…>` 时 complete=false。 */
  line: string;
  complete: boolean;
  /** 回灌自家解析器的结果；含 TODO 的行不自检，值为 null。 */
  selfCheckOk: boolean | null;
  selfCheckErrors: string[];
  basis: string;
  loaderNote: string;
}

export interface AccessLinesResult {
  entries: AccessLineEntry[];
  /** 文件头 / 落盘位置提示。 */
  headers: Partial<Record<AccessLineFormat, string>>;
  notes: string[];
}

// 语法出处（本轮逐行读到）：
// Forge AT：data/forge_1.20.1/forge-docs/1.20.1/processed/advanced_accesstransformers.md
//   :55「the SRG name must be used for fields and methods」、:75/:83 类与字段格式、:96 方法格式、
//   :111 类示例、:114 `protected-f … f_129758_ #random`、:118 `public net.minecraft.Util m_137477_(…)… #makeExecutor`
// NeoForge AT：data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/advanced_accesstransformers.md
//   :115/:127/:137 同格式但成员用可读名、示例 `protected-f net.minecraft.server.MinecraftServer random`、
//   :191 `public net.minecraft.Util makeExecutor(Ljava/lang/String;)…;`、:197 `… leastMostToIntArray(JJ)[I`
// AW：data/fabric_1.21.11/reference/1.21.11/src/main/resources/example-mod.classtweaker:1,8,13,16,22 与
//   data/fabric_1.21.11/fabric-docs/1.21.11/processed/develop_class-tweakers_access-widening.md
//   :82「names 须与当前映射层一致」、:93/:105/:117 三种条目格式、:74 private final 要两条条目
const AT_FORGE_BASIS = "data/forge_1.20.1/…/advanced_accesstransformers.md:55,111,114,118";
const AT_NEOFORGE_BASIS = "data/neoforge_1.21.1/…/advanced_accesstransformers.md:115,127,137,191,197";
const AW_BASIS = "data/fabric_1.21.11/reference/1.21.11/src/main/resources/example-mod.classtweaker:8,13,16,22";
const AW_FORMAT_BASIS = "data/fabric_1.21.11/fabric-docs/1.21.11/processed/develop_class-tweakers_access-widening.md:93,105,117";

/**
 * SRG 成员名的两种合法形状，逐字来自语料示例：
 * `func_`/`field_`（≤1.16.5，data/forge_1.12.2 侧库里全是这形状）与 `m_<id>_`/`f_<id>_`
 * （1.17+，data/forge_1.20.1/…/advanced_accesstransformers.md:114 `f_129758_`、:118 `m_137477_`）。
 * 刻意**不收**尾下划线以外的尾巴：`m_5_foo`、`m_1` 这类近失名一律当非 SRG ⇒ 宁可留 `<TODO:SRG名>`，
 * 也不把一个可疑名字写成看起来能用的行。
 */
const SRG_SHAPE_RE = /^(?:func_\d+_[A-Za-z0-9_$]*|field_\d+_[A-Za-z0-9_$]*|[mf]_\d+_)$/;

function toSlash(name: string): string {
  return name.trim().replace(/\./g, "/");
}

/** AT 用点号 FQCN（两边语料的示例都是点号 + `$` 内部类）。 */
function toDottedInner(name: string): string {
  return name.trim().replace(/\//g, ".");
}

function isSrgName(name: string | null | undefined): boolean {
  return Boolean(name && SRG_SHAPE_RE.test(name.trim()));
}

/** 可读 Java 名（才配当 AT 行尾的 `#注释`）：字母开头、≥3 字符、且不是 SRG 名。 */
const READABLE_RE = /^[a-zA-Z][a-zA-Z0-9_$]{2,}$/;

function readableName(...candidates: Array<string | null | undefined>): string | null {
  for (const c of candidates) {
    const t = c?.trim();
    if (t && READABLE_RE.test(t) && !isSrgName(t)) return t;
  }
  return null;
}

function accessToken(access: string, finalOp?: "add" | "remove"): string {
  return `${access}${finalOp === "add" ? "+f" : finalOp === "remove" ? "-f" : ""}`;
}

/**
 * 「同一个 MC 版本两边都有映射库」时按加载器改判（与 `convert-extras` 共用这一条，别写两份）。
 * 只有 `forge` 改判：1.17–1.20.x 的 Forge 查询若不指定，会被 Fabric 的 yarn-tiny 库回答
 * （那份库的 name_official 是 notch 短名 ⇒ 把查得到报成查不到）。`neoforge` 等本仓无库的档给 null。
 */
export function preferMappingDb(loader?: AccessLoader | null): MappingDbPreference | null {
  return loader === "forge" ? "forge" : null;
}

/** 映射库里的 named 层成员行（fabric=yarn 名；forge-srg/tsrg=SRG 名）。 */
function memberRow(
  req: AccessLineRequest,
): { row: MethodRow | FieldRow } | null {
  if (!req.memberName || !req.version) return null;
  const common = {
    ownerClass: req.className,
    memberName: req.memberName,
    descriptor: req.descriptor,
    preferPlatform: preferMappingDb(req.loader),
  };
  for (const from of ["mcp", "intermediary", "obfuscated"] as const) {
    const r =
      req.memberKind === "field"
        ? lookupField(req.version, { ...common, from })
        : lookupMethod(req.version, { ...common, from });
    if (r.found && r.row && !r.ambiguous) return { row: r.row as MethodRow | FieldRow };
  }
  return null;
}

type SelfCheck = { ok: boolean | null; errors: string[] };

function selfCheckAt(line: string): SelfCheck {
  const { errors } = parseAccessTransformer(line);
  return { ok: errors.length === 0, errors: errors.map((e) => e.issue) };
}

function selfCheckAw(header: string, line: string): SelfCheck {
  const { errors } = parseAccessWidener(`${header}\n${line}`);
  return { ok: errors.length === 0, errors: errors.map((e) => e.issue) };
}

const AW_HEADER_V2 = "accessWidener v2 named";

/**
 * AW 头的 namespace 必须和条目名同层（access-widening.md:82「names 须与当前映射层一致」；
 * 三个合法值 named / intermediary / official 见本仓解析器 AW_NAMESPACES）。
 */
function awHeaderFor(toLayer?: AccessLineRequest["toLayer"]): string {
  if (toLayer === "intermediary") return "accessWidener v2 intermediary";
  if (toLayer === "mojang" || toLayer === "obfuscated") return "accessWidener v2 official";
  return AW_HEADER_V2;
}

/**
 * 生成 AT（Forge / NeoForge）与 AW（Fabric / Quilt）条目行。
 * @param req 至少要有 version + className；成员级还要 memberName。
 */
export function buildAccessLines(req: AccessLineRequest): AccessLinesResult {
  const notes: string[] = [];
  const entries: AccessLineEntry[] = [];
  const headers: Partial<Record<AccessLineFormat, string>> = {};
  const loader = req.loader;

  if (!req.className?.trim()) {
    return { entries, headers, notes: ["accessLines 需要 ownerClass（类名）才能生成条目行"] };
  }
  if (req.memberKind !== "class" && !req.memberName?.trim()) {
    return { entries, headers, notes: [`accessLines：memberKind=${req.memberKind} 需要 memberName`] };
  }
  if (loader && loader !== "forge" && loader !== "neoforge" && loader !== "fabric" && loader !== "quilt") {
    return {
      entries,
      headers,
      notes: [
        `loader=${loader} 既不用 AT 也不用 AW：LiteLoader / Rift / ModLoader 没有这套条目文件，基岩走 Script；`
          + `要条目行请传 platform=forge|neoforge|fabric|quilt`,
      ],
    };
  }

  const access = req.access ?? "public";
  const wantAt = !loader || loader === "forge" || loader === "neoforge";
  const wantAw = !loader || loader === "fabric" || loader === "quilt";
  const dotted = toDottedInner(req.className);
  const slashed = toSlash(req.className);
  const row = req.memberKind === "class" ? null : memberRow(req)?.row ?? null;
  const descriptor = req.descriptor?.trim() || row?.descriptor_named || null;
  if (!req.descriptor?.trim() && row?.descriptor_named) {
    notes.push(
      "descriptor 未由你传入，取自本档映射库的 named 层（fabric 档 = Yarn 包名，forge-srg/tsrg 档 = SRG 层包名）。"
        + "工程用的映射层不同 ⇒ 描述符里的类引用要换成工程那层再写条目。",
    );
  }

  const atLoaderNote =
    loader === "neoforge"
      ? "NeoForge AT 成员行用可读名、无 `#` 注释"
      : loader === "forge"
        ? "Forge AT 成员行必须 SRG 名（语料 :55）"
        : "未给 platform：Forge 线要 SRG 名、NeoForge 线要可读名，两套不可混用";

  // ── AT（Forge / NeoForge）──────────────────────────────────────────────────
  if (wantAt) {
    headers.at = "META-INF/accesstransformer.cfg（非开发环境 Forge 只认这个路径，语料 :20-24）";
    notes.push(
      "AT 行里的类名 = 本次转换的目标层名（未命中时按你传入的原名）；成员名另按加载器分叉——"
        + "Forge 要 SRG 名，NeoForge 要工程里的可读名。",
    );
    if (req.memberKind === "class") {
      const line = `${access} ${dotted}`;
      const sc = selfCheckAt(line);
      entries.push({
        format: "at",
        line,
        complete: true,
        selfCheckOk: sc.ok,
        selfCheckErrors: sc.errors,
        basis: `${AT_FORGE_BASIS}（类格式 \`<access modifier> <fully qualified class name>\`，内部类用 $）`,
        loaderNote: atLoaderNote,
      });
      notes.push("AT 类级行不需要 SRG 名（:55 只约束字段与方法）。");
    } else {
      const readable = req.memberName!.trim();
      const srg = isSrgName(readable)
        ? readable
        : row?.name_named && isSrgName(row.name_named)
          ? row.name_named
          : null;
      if (loader === "neoforge") {
        const line =
          req.memberKind === "method"
            ? `${accessToken(access, req.finalOp)} ${dotted} ${readable}${descriptor ?? "<TODO:描述符>"}`
            : `${accessToken(access, req.finalOp)} ${dotted} ${readable}`;
        const complete = req.memberKind === "field" || Boolean(descriptor);
        const sc = complete ? selfCheckAt(line) : { ok: null, errors: [] };
        entries.push({
          format: "at",
          line,
          complete,
          selfCheckOk: sc.ok,
          selfCheckErrors: sc.errors,
          basis: AT_NEOFORGE_BASIS,
          loaderNote: atLoaderNote,
        });
      } else {
        // `#<可读名>` 是注释（语料 :44「# 之后全是注释」）：没有可读名可用时不写注释，
        // 绝不把混淆短名（如 #h）当可读名写进去。
        const commentText = readableName(readable, req.memberNameInput);
        const comment = commentText ? ` #${commentText}` : "";
        const line =
          req.memberKind === "method"
            ? `${accessToken(access, req.finalOp)} ${dotted} ${srg ?? "<TODO:SRG名>"}${descriptor ?? "<TODO:描述符>"}${comment}`
            : `${accessToken(access, req.finalOp)} ${dotted} ${srg ?? "<TODO:SRG名>"}${comment}`;
        const complete = Boolean(srg) && (req.memberKind === "field" || Boolean(descriptor));
        const sc = complete ? selfCheckAt(line) : { ok: null, errors: [] };
        entries.push({
          format: "at",
          line,
          complete,
          selfCheckOk: sc.ok,
          selfCheckErrors: sc.errors,
          basis: AT_FORGE_BASIS,
          loaderNote: atLoaderNote,
        });
        if (!srg) {
          notes.push(
            `AT 成员行留了 <TODO:SRG名>：本档映射库的 named 层不是 SRG 形状（或该版本没有映射库），`
              + `而语料 :55 要求字段/方法必须用 SRG 名 ⇒ 不拿可读名顶替。`,
          );
        }
      }
      if (req.memberKind === "method" && !descriptor) {
        notes.push(
          "方法条目行缺描述符（格式段 `<method name>(<parameter types>)<return type>`）；"
            + "传 descriptor 后本行才完整。",
        );
      }
      notes.push("改过 AT 文件后要刷新 Gradle 工程才生效（Forge 语料 :22）。");
    }
  }

  // ── AW / class tweaker（Fabric / Quilt）────────────────────────────────────
  if (wantAw) {
    const awHeader = awHeaderFor(req.toLayer);
    if (!req.toLayer) {
      notes.push(
        "本次转换未命中 ⇒ 条目名按你传入的原名写，其映射层未经本工具确认；头先给 named，"
          + "若你传的是 intermediary / 混淆短名，要把头改成对应的 intermediary / official。",
      );
    }
    headers.aw = `${awHeader}（或 Loader 0.18.0+ / Loom 1.12+ 的 classTweaker v1 named，见 index.md:16,26）`;
    if (req.memberKind === "class") {
      const line = `accessible    class    ${slashed}`;
      const sc = selfCheckAw(awHeader, line);
      entries.push({
        format: "aw",
        line,
        complete: true,
        selfCheckOk: sc.ok,
        selfCheckErrors: sc.errors,
        basis: `${AW_BASIS} + ${AW_FORMAT_BASIS}（类用 internal name）`,
        loaderNote: "类名须与工程当前映射层一致（access-widening.md:82）",
      });
    } else {
      const member = req.memberName!.trim();
      const kindWord = req.memberKind;
      const line = `accessible    ${kindWord}    ${slashed}    ${member}    ${descriptor ?? "<TODO:描述符>"}`;
      const complete = Boolean(descriptor);
      const sc = complete ? selfCheckAw(awHeader, line) : { ok: null, errors: [] };
      entries.push({
        format: "aw",
        line,
        complete,
        selfCheckOk: sc.ok,
        selfCheckErrors: sc.errors,
        basis: `${AW_BASIS} + ${AW_FORMAT_BASIS}（\`<accessible / extendable>    ${kindWord}    <className>    <${kindWord}Name>    <${kindWord}Descriptor>\`）`,
        loaderNote: `${kindWord} 名与描述符必须同为工程映射层的名（access-widening.md:82）`,
      });
      if (!descriptor) {
        notes.push(`AW ${kindWord} 条目必须带描述符（access-widening.md:105,117）；传 descriptor 后本行才完整。`);
      }
      if (kindWord === "field") {
        notes.push("private final 字段要「既可读又可改」得写两条条目（accessible + mutable，access-widening.md:74）。");
      }
    }
  }

  return { entries, headers, notes };
}
