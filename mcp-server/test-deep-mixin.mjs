/**
 * T4 字节码级 Mixin / AT / AW 校验测试（RED→GREEN，CI 安全：无需 javac / 无网络）
 *
 * 覆盖：
 * - bytecode.ts：手工构造 class fixture（本机无 javac，Java 1.8 仅运行时）→
 *   parseClassFile 提取类名/父类/方法/字段/record 组件/调用点；jar 加载与类枚举
 * - access-transformer.ts：AT 存在性校验 + 继承成员 + 跨 AT 冲突
 * - access-widener.ts：AW 存在性校验 + transitive + 跨 AW 冲突
 * - deep-validate.ts：目标类存在性 / 方法选择器 / @At(target=...) 调用点校验
 * - mixinAnalyze 回归：deep 默认 false 时输出形状零变化；deep:true 无 jar → CACHE_MISS；
 *   deep:true + jarPath → 真实字节码校验
 *
 * 用法：node test-deep-mixin.mjs （前置：npm run build）
 */
import assert from "node:assert/strict";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";

import { parseClassFile, loadClassFileFromJar, collectJarClasses, buildJarIndex } from "./dist/mixin/bytecode.js";
import { validateAccessTransformer, validateAccessTransformerFiles } from "./dist/mixin/access-transformer.js";
import { validateAccessWidener, validateAccessWidenerFiles } from "./dist/mixin/access-widener.js";
import { deepValidateMixins, validateAtHandler, validateAwHandler } from "./dist/mixin/deep-validate.js";
import { mixinAnalyze } from "./dist/mixin/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const TMP = join(tmpdir(), `mc-skill-deep-mixin-${process.pid}`);
const JAR_PATH = join(TMP, "fixture.jar");

// ── fixture zip 构造（与 test-decompile.mjs 同款，store + deflate 零依赖）────────
function makeZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name, "utf8");
    const dataBuf = Buffer.isBuffer(f.data) ? f.data : Buffer.from(String(f.data), "utf8");
    const method = f.deflate ? 8 : 0;
    const payload = f.deflate ? deflateRawSync(dataBuf) : dataBuf;
    const flags = 0x0800;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(crc32(dataBuf), 14);
    local.writeUInt32LE(payload.length, 18);
    local.writeUInt32LE(dataBuf.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    chunks.push(local, nameBuf, payload);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(flags, 8);
    cd.writeUInt16LE(method, 10);
    cd.writeUInt32LE(crc32(dataBuf), 16);
    cd.writeUInt32LE(payload.length, 20);
    cd.writeUInt32LE(dataBuf.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += 30 + nameBuf.length + payload.length;
  }
  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, centralBuf, eocd]);
}

// ── class file fixture 构造（无 javac，手工按 JVMS 规范拼字节）──────────────────
const u2 = (v) => {
  const b = Buffer.alloc(2);
  b.writeUInt16BE(v, 0);
  return b;
};
const u4 = (v) => {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(v >>> 0, 0);
  return b;
};

class CpPool {
  constructor() {
    this.entries = [];
    this.utf8Idx = new Map();
    this.otherIdx = new Map();
  }
  utf8(s) {
    if (this.utf8Idx.has(s)) return this.utf8Idx.get(s);
    const idx = this.entries.length + 1;
    this.utf8Idx.set(s, idx);
    const body = Buffer.from(s, "utf8");
    this.entries.push(Buffer.concat([Buffer.from([1]), u2(body.length), body]));
    return idx;
  }
  cls(name) {
    const key = `c:${name}`;
    if (this.otherIdx.has(key)) return this.otherIdx.get(key);
    const nameIdx = this.utf8(name);
    const idx = this.entries.length + 1;
    this.otherIdx.set(key, idx);
    this.entries.push(Buffer.concat([Buffer.from([7]), u2(nameIdx)]));
    return idx;
  }
  nameType(name, desc) {
    const key = `nt:${name}${desc}`;
    if (this.otherIdx.has(key)) return this.otherIdx.get(key);
    const n = this.utf8(name);
    const d = this.utf8(desc);
    const idx = this.entries.length + 1;
    this.otherIdx.set(key, idx);
    this.entries.push(Buffer.concat([Buffer.from([12]), u2(n), u2(d)]));
    return idx;
  }
  methodRef(owner, name, desc) {
    const key = `mr:${owner}#${name}${desc}`;
    if (this.otherIdx.has(key)) return this.otherIdx.get(key);
    const c = this.cls(owner);
    const nt = this.nameType(name, desc);
    const idx = this.entries.length + 1;
    this.otherIdx.set(key, idx);
    this.entries.push(Buffer.concat([Buffer.from([10]), u2(c), u2(nt)]));
    return idx;
  }
  fieldRef(owner, name, desc) {
    const key = `fr:${owner}#${name}${desc}`;
    if (this.otherIdx.has(key)) return this.otherIdx.get(key);
    const c = this.cls(owner);
    const nt = this.nameType(name, desc);
    const idx = this.entries.length + 1;
    this.otherIdx.set(key, idx);
    this.entries.push(Buffer.concat([Buffer.from([9]), u2(c), u2(nt)]));
    return idx;
  }
  build() {
    return Buffer.concat(this.entries);
  }
}

/** 构造一个可被 parseClassFile 正确解析的最小合法 class。
 *  withMembers=true：字段 value:I + 方法 <init>()V / getValue()I / apply()V + Record 属性。
 */
function makeFixtureClass(className, superName, withMembers, accessFlags = 0x0021) {
  const p = new CpPool();
  const self = p.cls(className);
  const sup = p.cls(superName);
  const initDesc = p.utf8("()V");
  const codeName = p.utf8("Code");

  const codeAttr = (code, maxStack) => {
    const inner = Buffer.concat([
      u2(maxStack), u2(1), u4(code.length), code, u2(0), u2(0),
    ]);
    return Buffer.concat([u2(codeName), u4(inner.length), inner]);
  };

  const methods = [];
  // <init>()V：aload_0, invokespecial super.<init>, return
  const initCode = Buffer.concat([
    Buffer.from([0x2a, 0xb7]), u2(p.methodRef(superName, "<init>", "()V")), Buffer.from([0xb1]),
  ]);
  methods.push(Buffer.concat([
    u2(0x0001), u2(p.utf8("<init>")), u2(initDesc), u2(1), codeAttr(initCode, 1),
  ]));

  if (withMembers) {
    // getValue()I：aload_0, getfield value:I, ireturn
    const getCode = Buffer.concat([
      Buffer.from([0x2a, 0xb4]), u2(p.fieldRef(className, "value", "I")), Buffer.from([0xac]),
    ]);
    methods.push(Buffer.concat([
      u2(0x0001), u2(p.utf8("getValue")), u2(p.utf8("()I")), u2(1), codeAttr(getCode, 1),
    ]));
    // apply()V：aload_0, invokevirtual getValue()I, pop, return（调用点供 @At(target) 校验）
    const applyCode = Buffer.concat([
      Buffer.from([0x2a, 0xb6]), u2(p.methodRef(className, "getValue", "()I")),
      Buffer.from([0x57, 0xb1]),
    ]);
    methods.push(Buffer.concat([
      u2(0x0001), u2(p.utf8("apply")), u2(p.utf8("()V")), u2(1), codeAttr(applyCode, 1),
    ]));
  }

  const classAttrs = [];
  if (withMembers) {
    const recName = p.utf8("Record");
    const recInner = Buffer.concat([
      u2(1),
      u2(p.utf8("value")), u2(p.utf8("I")), u2(0), // component: name + desc + 0 attrs
    ]);
    classAttrs.push(Buffer.concat([u2(recName), u4(recInner.length), recInner]));
  }

  return Buffer.concat([
    Buffer.from([0xca, 0xfe, 0xba, 0xbe]), u2(0), u2(52),
    u2(p.entries.length + 1), p.build(),
    u2(accessFlags), u2(self), u2(sup),
    u2(0), // interfaces
    u2(withMembers ? 1 : 0),
    ...(withMembers
      ? [Buffer.concat([u2(0x0002), u2(p.utf8("value")), u2(p.utf8("I")), u2(0)])]
      : []),
    u2(methods.length), ...methods,
    u2(classAttrs.length), ...classAttrs,
  ]);
}

// ── fixture 内容 ───────────────────────────────────────────────────────────────
const FIXTURE_BYTES = makeFixtureClass("com/example/Fixture", "java/lang/Object", true);
const SUBFIXTURE_BYTES = makeFixtureClass("com/example/SubFixture", "com/example/Fixture", false);
/** ACC_PRIVATE 内部类（0x0002|ACC_SUPER），供 deepValidate private 目标报错 */
const PRIVATE_INNER_BYTES = makeFixtureClass("com/example/Fixture$Inner", "java/lang/Object", false, 0x0022);

const AT_VALID = [
  "public com/example/Fixture getValue ()I",
  "protected com.example.Fixture value I", // 点号 owner + 字段
  "public com/example/Fixture", // 类级
  "public com/example/SubFixture getValue ()I", // 继承成员（声明于 Fixture）
].join("\n");
const AT_BAD_MEMBER = "public com/example/Fixture noSuchMethod ()V";
const AT_BAD_CLASS = "public com/example/NoSuchClass";
const AT_CONFLICT_A = "public com/example/Fixture getValue ()I";
const AT_CONFLICT_B = "protected com/example/Fixture getValue ()I";

const AW_VALID = [
  "accessWidener v2 named",
  "accessible class com/example/Fixture",
  "extendable class com/example/SubFixture",
  "accessible method com/example/Fixture getValue ()I",
  "accessible field com/example/Fixture value I",
  "transitive accessible class com/example/Fixture",
].join("\n");
const AW_BAD = "accessWidener v2 named\naccessible method com/example/Fixture nope ()V";
const AW_BAD_NS = "accessWidener v2 bogus\naccessible class com/example/Fixture";
const AW_CONFLICT_A = "accessWidener v2 named\naccessible class com/example/Fixture";
const AW_CONFLICT_B = "accessWidener v2 named\nextendable class com/example/Fixture";

const MIXIN_OK = `
@Mixin(com.example.Fixture.class)
public class FixtureMixin {
  @Inject(method = "getValue", at = @At("HEAD"))
  private void onGet(CallbackInfo ci) {}
}`;
const MIXIN_PRIVATE_INNER = `
@Mixin(com.example.Fixture$Inner.class)
public class PrivateInnerMixin {
  @Inject(method = "<init>", at = @At("RETURN"))
  private void onInit(CallbackInfo ci) {}
}`;
const MIXIN_MISSING_CLASS = `
@Mixin(com.example.Nope.class)
public class NopeMixin {
  @Inject(method = "getValue", at = @At("HEAD"))
  private void onGet(CallbackInfo ci) {}
}`;
const MIXIN_BAD_METHOD = `
@Mixin(com.example.Fixture.class)
public class FixtureMixin {
  @Inject(method = "nope", at = @At("HEAD"))
  private void onNope(CallbackInfo ci) {}
}`;
const MIXIN_AT_INVOKE = `
@Mixin(com.example.Fixture.class)
public class FixtureMixin {
  @Inject(method = "apply", at = @At(value = "INVOKE", target = "Lcom/example/Fixture;getValue()I"))
  private void aroundGet(CallbackInfo ci) {}
}`;
const MIXIN_AT_INVOKE_BAD = `
@Mixin(com.example.Fixture.class)
public class FixtureMixin {
  @Inject(method = "apply", at = @At(value = "INVOKE", target = "Lcom/example/Fixture;nope()V"))
  private void aroundNope(CallbackInfo ci) {}
}`;

const MIXINS_JSON = JSON.stringify({
  package: "com.example.mixin",
  mixins: ["com.example.mixin.FooMixin"],
});

// ── 1. bytecode.ts ─────────────────────────────────────────────────────────────
function testBytecodeParser() {
  const info = parseClassFile(FIXTURE_BYTES);
  assert.equal(info.className, "com/example/Fixture");
  assert.equal(info.superName, "java/lang/Object");
  assert.deepEqual(info.interfaces, []);

  const methodNames = info.methods.map((m) => `${m.name}${m.descriptor}`).sort();
  assert.deepEqual(methodNames, ["<init>()V", "apply()V", "getValue()I"]);

  assert.equal(info.fields.length, 1);
  assert.equal(info.fields[0].name, "value");
  assert.equal(info.fields[0].descriptor, "I");
  assert.ok((info.fields[0].accessFlags & 0x0002) === 0x0002, "value 应为 private");

  assert.equal(info.recordComponents.length, 1, "Record 属性应解析出组件");
  assert.equal(info.recordComponents[0].name, "value");
  assert.equal(info.recordComponents[0].descriptor, "I");

  // 指令序列
  assert.deepEqual(info.methodCodes.get("apply()V"), [0x2a, 0xb6, 0x57, 0xb1]);
  // 调用点
  const applyCalls = info.calls.get("apply()V");
  assert.ok(applyCalls.length === 1);
  assert.equal(applyCalls[0].opcode, 0xb6); // invokevirtual
  assert.deepEqual(applyCalls[0].target, {
    owner: "com/example/Fixture",
    name: "getValue",
    desc: "()I",
  });
  const initCalls = info.calls.get("<init>()V");
  assert.equal(initCalls[0].opcode, 0xb7); // invokespecial
  assert.equal(initCalls[0].target.owner, "java/lang/Object");
  console.log("  [ok] parseClassFile: 类名/父类/方法/字段/record/指令/调用点");
}

function testJarLoading() {
  const bytes = loadClassFileFromJar(JAR_PATH, "com/example/Fixture");
  assert.ok(bytes && bytes.length === FIXTURE_BYTES.length, "jar 内 class 应可读出");
  assert.equal(loadClassFileFromJar(JAR_PATH, "com/example/Missing"), null);

  const names = collectJarClasses(JAR_PATH).sort();
  assert.deepEqual(names, ["com/example/Fixture", "com/example/Fixture$Inner", "com/example/SubFixture"]);

  const index = buildJarIndex(JAR_PATH);
  assert.equal(index.hasClass("com/example/Fixture"), true);
  assert.equal(index.hasClass("com/example/Missing"), false);
  const cls = index.getClass("com/example/Fixture");
  assert.equal(cls?.className, "com/example/Fixture");
  assert.equal(cls?.methods.length, 3);
  console.log("  [ok] loadClassFileFromJar / collectJarClasses / buildJarIndex");
}

// ── 2. access-transformer.ts ──────────────────────────────────────────────────
function testAccessTransformer(index) {
  const valid = validateAccessTransformer(AT_VALID, index);
  assert.equal(valid.valid, true, `AT valid 应为 true: ${JSON.stringify(valid.errors)}`);
  assert.equal(valid.errors.length, 0);
  assert.equal(valid.checkedMembers, 3);

  const badMember = validateAccessTransformer(AT_BAD_MEMBER, index);
  assert.equal(badMember.valid, false);
  assert.ok(badMember.errors.length === 1);
  assert.ok(badMember.errors[0].target.includes("noSuchMethod"));
  assert.ok(badMember.errors[0].suggestion.length > 0);

  const badClass = validateAccessTransformer(AT_BAD_CLASS, index);
  assert.equal(badClass.valid, false);
  assert.ok(badClass.errors[0].target.includes("NoSuchClass"));

  const conflicts = validateAccessTransformerFiles([AT_CONFLICT_A, AT_CONFLICT_B], index);
  assert.ok(conflicts.crossFileConflicts.length >= 1, "跨 AT 冲突应被检出");
  assert.equal(conflicts.crossFileConflicts[0].target, "com/example/Fixture#getValue()I");
  assert.ok(conflicts.crossFileConflicts[0].accessA !== conflicts.crossFileConflicts[0].accessB);

  const dup = validateAccessTransformerFiles([AT_CONFLICT_A, AT_CONFLICT_A], index);
  assert.ok(dup.warnings.some((w) => w.includes("重复")), "重复 AT 应告警");
  console.log("  [ok] AT: 存在性/继承成员/跨文件冲突/重复告警");
}

// ── 3. access-widener.ts ──────────────────────────────────────────────────────
function testAccessWidener(index) {
  const valid = validateAccessWidener(AW_VALID, index);
  assert.equal(valid.valid, true, `AW valid 应为 true: ${JSON.stringify(valid.errors)}`);
  assert.equal(valid.errors.length, 0);

  const bad = validateAccessWidener(AW_BAD, index);
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.some((e) => e.target.includes("nope")));

  const badNs = validateAccessWidener(AW_BAD_NS, index);
  assert.ok(badNs.warnings.some((w) => w.includes("namespace") || w.includes("bogus")));

  const conflicts = validateAccessWidenerFiles([AW_CONFLICT_A, AW_CONFLICT_B], index);
  assert.ok(conflicts.crossFileConflicts.length >= 1, "跨 AW 冲突应被检出");
  console.log("  [ok] AW: 存在性/transitive/namespace 告警/跨文件冲突");
}

// ── 4. deep-validate.ts ───────────────────────────────────────────────────────
async function testDeepValidate() {
  const ok = await deepValidateMixins({
    javaFiles: [{ path: "FixtureMixin.java", content: MIXIN_OK }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(ok.verified, true, `目标存在时应 verified: ${JSON.stringify(ok.errors)}`);

  const missingClass = await deepValidateMixins({
    javaFiles: [{ path: "NopeMixin.java", content: MIXIN_MISSING_CLASS }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(missingClass.verified, false);
  assert.ok(missingClass.errors.some((e) => e.target.includes("Nope")), JSON.stringify(missingClass.errors));

  const badMethod = await deepValidateMixins({
    javaFiles: [{ path: "FixtureMixin.java", content: MIXIN_BAD_METHOD }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(badMethod.verified, false);
  assert.ok(badMethod.errors.some((e) => e.target.includes("nope")), JSON.stringify(badMethod.errors));

  const atInvoke = await deepValidateMixins({
    javaFiles: [{ path: "FixtureMixin.java", content: MIXIN_AT_INVOKE }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(atInvoke.verified, true, `@At(target=...) 调用点存在时应 verified: ${JSON.stringify(atInvoke.errors)}`);

  const atInvokeBad = await deepValidateMixins({
    javaFiles: [{ path: "FixtureMixin.java", content: MIXIN_AT_INVOKE_BAD }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(atInvokeBad.verified, false);
  console.log("  [ok] deep-validate: 目标类/选择器/@At 调用点");

  // validate_at / validate_aw 工具 handler
  const hAt = validateAtHandler({ atContent: AT_VALID, version: "1.20.1", jarPath: JAR_PATH });
  assert.equal(hAt.ok, true);
  assert.equal(hAt.valid, true);
  assert.equal(hAt.checkedMembers, 3);

  const hAw = validateAwHandler({ awContent: AW_VALID, version: "1.20.1", jarPath: JAR_PATH });
  assert.equal(hAw.ok, true);
  assert.equal(hAw.valid, true);

  const noJar = validateAtHandler({ atContent: AT_VALID, version: "1.20.1" });
  assert.equal(noJar.ok, false);
  assert.equal(noJar.action.code, "CACHE_MISS");
  console.log("  [ok] validate_at / validate_aw handler（含 CACHE_MISS）");

  // ACC_PRIVATE 内部类 → error + suggestion
  const priv = await deepValidateMixins({
    javaFiles: [{ path: "PrivateInnerMixin.java", content: MIXIN_PRIVATE_INNER }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(priv.verified, false);
  assert.ok(
    priv.errors.some((e) => /private/i.test(e.issue)),
    `expected private-class error: ${JSON.stringify(priv.errors)}`,
  );
  assert.ok(priv.errors.some((e) => e.suggestion && e.suggestion.length > 0));

  // @At(HEAD|RETURN) 无 target：不按调用点缺失报错
  const headOk = await deepValidateMixins({
    javaFiles: [{ path: "FixtureMixin.java", content: MIXIN_OK }],
    version: "1.20.1",
    jarPath: JAR_PATH,
  });
  assert.equal(headOk.verified, true, `HEAD 无 target 应通过: ${JSON.stringify(headOk.errors)}`);

  // projectPath：扫描 META-INF/*_at.cfg，跳过 build/
  const proj = join(TMP, "mod-project");
  mkdirSync(join(proj, "src", "main", "resources", "META-INF"), { recursive: true });
  mkdirSync(join(proj, "build", "resources", "main", "META-INF"), { recursive: true });
  writeFileSync(join(proj, "src", "main", "resources", "META-INF", "accesstransformer_at.cfg"), AT_VALID);
  writeFileSync(
    join(proj, "build", "resources", "main", "META-INF", "bogus_at.cfg"),
    "public com/example/Nope",
  );
  const fromProj = validateAtHandler({ projectPath: proj, version: "1.20.1", jarPath: JAR_PATH });
  assert.equal(fromProj.ok, true, JSON.stringify(fromProj));
  assert.equal(fromProj.valid, true);
  assert.ok(Array.isArray(fromProj.scannedFiles));
  assert.equal(fromProj.scannedFiles.length, 1, "build/ 下 AT 应被跳过");
  console.log("  [ok] private inner / HEAD-RETURN / projectPath 扫描");
}

// ── 5. mixinAnalyze 回归（deep 必须纯附加、静态路径零变化）───────────────────────
async function testMixinAnalyzeRegression() {
  process.env.MC_SKILL_DATA = DATA_DIR;

  // (a) 无 deep：输出形状与改动前完全一致（无 deepResult）
  const r0 = await mixinAnalyze({
    version: "1.20.1",
    mixinsJson: MIXINS_JSON,
  });
  assert.equal(r0.ok, true);
  assert.equal(r0.deepResult, undefined);
  assert.deepEqual(Object.keys(r0), [
    "ok", "version", "mixinsJson", "mixins", "warnings", "errors", "supportMatrix",
  ]);

  // (b) deep:true + 空缓存 → CACHE_MISS 引导，ok 仍为 true，静态字段不变
  const emptyCache = join(TMP, "empty-cache");
  mkdirSync(emptyCache, { recursive: true });
  process.env.MC_SKILL_CACHE = emptyCache;
  const r1 = await mixinAnalyze({
    version: "1.20.1",
    deep: true,
    mixinsJson: MIXINS_JSON,
  });
  assert.equal(r1.ok, true);
  assert.equal(r1.deepResult.available, false);
  assert.equal(r1.deepResult.action.code, "CACHE_MISS");
  assert.ok(r1.deepResult.action.nextSteps.some((s) => s.includes("get_minecraft_source")));
  assert.equal(r1.errors.length, 0, "静态 errors 不应受 deep 影响");

  // (c) deep:true + jarPath → 真实字节码校验
  const r2 = await mixinAnalyze({
    version: "1.20.1",
    deep: true,
    jarPath: JAR_PATH,
    javaFiles: [{ path: "FixtureMixin.java", content: MIXIN_OK }],
  });
  assert.equal(r2.deepResult.available, true);
  assert.equal(r2.deepResult.verified, true);
  assert.equal(r2.deepResult.jarPath, JAR_PATH);
  console.log("  [ok] mixinAnalyze 回归: 无 deep 形状不变 / CACHE_MISS / jarPath 深度校验");
}

async function main() {
  mkdirSync(TMP, { recursive: true });
  writeFileSync(JAR_PATH, makeZip([
    { name: "com/example/Fixture.class", data: FIXTURE_BYTES },
    { name: "com/example/SubFixture.class", data: SUBFIXTURE_BYTES },
    { name: "com/example/Fixture$Inner.class", data: PRIVATE_INNER_BYTES },
  ]));

  try {
    testBytecodeParser();
    testJarLoading();
    const index = buildJarIndex(JAR_PATH);
    testAccessTransformer(index);
    testAccessWidener(index);
    await testDeepValidate();
    await testMixinAnalyzeRegression();
    console.log("test-deep-mixin: ok");
  } finally {
    delete process.env.MC_SKILL_CACHE;
    rmSync(TMP, { recursive: true, force: true });
  }
  // queryApi 的 Worker 预加载（静态解析路径）可能持有事件循环句柄（服务生命周期设计）；
  // 所有断言已完成，显式退出避免测试进程悬挂。
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
