import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import {
  buildProvenance,
  fetchV2Tiny,
  parseTinyV2,
  readZipEntry,
  repairNamed,
  sha256Hex,
  yarnV2JarUrls,
} from "./repair-yarn-named.mjs";

/**
 * 合成夹具（列形态对照 data/fabric_1.21.11/mappings/yarn-1.21.11+build.6-tiny.gz 实测）：
 *   v1: CLASS(4) official|intermediary|named；FIELD/METHOD(6) owner|desc|official|intermediary|named
 *   v2: 头行 `tiny\t2\t0\t<命名空间…>`；c 行 1 tab 起名；\tf/\tm 行 2 tab 起描述符再起名
 */
const V1_LOSSY = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/class_1", // 有损：named==intermediary
  "CLASS\tb\tnet/minecraft/class_2\tnet/minecraft/Old", // v1 有真名但与 v2 不同 → conflict
  "CLASS\tc\tnet/minecraft/class_3\tnet/minecraft/class_3", // v2 缺该类 → missClass
  "METHOD\ta\t()V\trun\tmethod_1\tmethod_1", // v2 有 → memberFixed
  "METHOD\ta\t(I)V\teat\tmethod_2\tmethod_2", // v2 缺 → missMember + stillSelfEqUnmatched
  "FIELD\tb\tI\tx\tfield_1\tfield_1", // v2 有 → memberFixed
  "",
].join("\n");

const V2_TWO_NS = [
  "tiny\t2\t0\tintermediary\tnamed",
  "c\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "\tm\t()V\tmethod_1\tdoRun",
  "c\tnet/minecraft/class_2\tnet/minecraft/Beta",
  "\tf\tI\tfield_1\tcount",
  "",
].join("\n");

const V2_THREE_NS = [
  "tiny\t2\t0\tofficial\tintermediary\tnamed",
  "c\talpha\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "\tm\t()V\trun\tmethod_1\tdoRun",
  "\t\tp\t1\t\targ",
  "",
].join("\n");

// ── readZipEntry ─────────────────────────────────────────────────────────────

function u16(v) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(v);
  return b;
}
function u32(v) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(v);
  return b;
}

/** 最小 zip：store/deflate 条目 + central directory + EOCD（readZipEntry 走 central directory）。 */
function makeZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const method = e.method ?? 0;
    const data = method === 8 ? zlib.deflateRawSync(e.data) : e.data;
    const lh = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(method),
      u16(0),
      u16(0),
      u32(0),
      u32(data.length),
      u32(e.data.length),
      u16(name.length),
      u16(0),
      name,
    ]);
    locals.push(lh, data);
    const ch = Buffer.concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(method),
      u16(0),
      u16(0),
      u32(0),
      u32(data.length),
      u32(e.data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);
    centrals.push(ch);
    offset += lh.length + data.length;
  }
  const cd = Buffer.concat(centrals);
  const eocd = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(cd.length),
    u32(offset),
    u16(0),
  ]);
  return Buffer.concat([...locals, cd, eocd]);
}

test("readZipEntry: 手写最小 zip 的 store 与 deflate 条目都能解出原文", () => {
  const tinyText = "tiny\t2\t0\tintermediary\tnamed\nc\tclass_1\tAlpha\n";
  const zip = makeZip([
    { name: "mappings/mappings.tiny", data: Buffer.from(tinyText, "utf8"), method: 8 },
    { name: "other.txt", data: Buffer.from("stored-bytes", "utf8"), method: 0 },
  ]);
  const got = readZipEntry(zip, "mappings/mappings.tiny");
  assert.ok(got, "deflate 条目必须命中");
  assert.equal(got.toString("utf8"), tinyText);
  assert.equal(readZipEntry(zip, "other.txt")?.toString("utf8"), "stored-bytes");
  assert.equal(readZipEntry(zip, "mappings/nope.txt"), null, "缺失 entry 返回 null");
  assert.equal(readZipEntry(Buffer.from("not a zip at all"), "x"), null, "无 EOCD 返回 null");
});

// ── parseTinyV2 ──────────────────────────────────────────────────────────────

test("parseTinyV2: 2 命名空间（-v2.jar 形态）按头行定位 intermediary/named 列", () => {
  const p = parseTinyV2(V2_TWO_NS);
  assert.deepEqual(p.namespaces, ["intermediary", "named"]);
  assert.equal(p.intermediaryIdx, 0);
  assert.equal(p.namedIdx, 1);
  assert.equal(p.classes.length, 2);
  assert.equal(p.members.length, 2);
  assert.equal(p.classNamed.get("net/minecraft/class_1"), "net/minecraft/Alpha");
  assert.equal(p.memberNamed.get("net/minecraft/class_1.method_1:()V"), "doRun");
  assert.equal(p.memberNamed.get("net/minecraft/class_2.field_1:I"), "count");
  // 未命名的成员行（缓存实测 10,077 行 id 形态）也进表；\t\tp 参数行不计
  assert.equal(p.base.classes, 2);
  assert.equal(p.base.members, 2);
});

test("parseTinyV2: 3 命名空间（mergedv2 形态）member 名从第 4 列起", () => {
  const p = parseTinyV2(V2_THREE_NS);
  assert.deepEqual(p.namespaces, ["official", "intermediary", "named"]);
  assert.equal(p.intermediaryIdx, 1);
  assert.equal(p.namedIdx, 2);
  assert.equal(p.classNamed.get("net/minecraft/class_1"), "net/minecraft/Alpha");
  assert.equal(p.memberNamed.get("net/minecraft/class_1.method_1:()V"), "doRun");
});

test("parseTinyV2: 非 v2 头 / 缺 intermediary|named 命名空间必须抛错", () => {
  assert.throws(() => parseTinyV2("v1\tofficial\tintermediary\tnamed\n"), /不是 tiny v2/);
  assert.throws(() => parseTinyV2("tiny\t2\t0\tofficial\tnamed\nc\ta\tb\n"), /缺 intermediary\/named/);
  assert.throws(() => parseTinyV2(""), /不是 tiny v2/);
});

// ── repairNamed ──────────────────────────────────────────────────────────────

test("repairNamed: 仅 named 列被替换，official/intermediary/头行/行数逐字节不动", () => {
  const { newTinyText, stats, changed } = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: V2_TWO_NS });
  assert.equal(changed, true);
  const origLines = V1_LOSSY.split("\n");
  const newLines = newTinyText.split("\n");
  assert.equal(newLines.length, origLines.length, "行数不得变化");
  // 最后一列（named）之外的全部列逐字节相同 = official/intermediary/头行字节不动
  assert.deepEqual(
    newLines.map((l) => l.split("\t").slice(0, -1)),
    origLines.map((l) => l.split("\t").slice(0, -1)),
  );
  assert.ok(newTinyText.startsWith("v1\tofficial\tintermediary\tnamed\n"));
  assert.ok(newLines[1].endsWith("\tnet/minecraft/Alpha"), "class_1 的 named 被修复");
  assert.ok(newLines[4].endsWith("\tdoRun"), "method_1 的 named 被修复");
  assert.ok(newLines[6].endsWith("\tcount"), "field_1 的 named 被修复");

  assert.equal(stats.classes, 3);
  assert.equal(stats.classFixed, 2);
  assert.equal(stats.members, 3);
  assert.equal(stats.memberFixed, 2);
  assert.equal(typeof stats.missClass, "number", "missClass 必须是数字（one-off .length bug 的回归钉）");
  assert.equal(stats.missClass, 1);
  assert.equal(typeof stats.missMember, "number", "missMember 必须是数字");
  assert.equal(stats.missMember, 1);
  assert.equal(stats.stillSelfEqUnmatched, 1);
  assert.equal(stats.conflict.length, 1);
  assert.match(stats.conflict[0], /CLASS net\/minecraft\/class_2: v1=net\/minecraft\/Old v2=net\/minecraft\/Beta/);
  assert.equal(stats.classSelfEqBefore, 2);
  assert.equal(stats.classSelfEqAfter, 1, "class_1 修复后只剩 class_3 仍 selfEq");
  assert.equal(stats.memberSelfEqBefore, 3);
  assert.equal(stats.memberSelfEqAfter, 1);
  assert.equal(stats.v2Base.members, 2);
});

test("repairNamed: v2 缺的成员计入 missMember（数字），不覆写 v1 既有 named", () => {
  const { newTinyText, stats } = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: V2_TWO_NS });
  const row = newTinyText.split("\n")[5]; // METHOD a (I)V eat method_2 method_2
  assert.ok(row.endsWith("\tmethod_2"), "v2 缺名时保留 v1 原列");
  assert.deepEqual(stats.missMemberSample, ["METHO net/minecraft/class_1.method_2:(I)V"]);
});

test("repairNamed: 严格 idempotent —— 已修复文本再跑 changed=false 且逐字节一致", () => {
  const first = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: V2_TWO_NS });
  const second = repairNamed({ tinyV1Text: first.newTinyText, v2TinyText: V2_TWO_NS });
  assert.equal(second.changed, false, "对已修复文本重跑必须 changed=false");
  assert.equal(second.newTinyText, first.newTinyText);
  assert.equal(second.stats.classFixed, 0);
  assert.equal(second.stats.memberFixed, 0);
});

test("repairNamed: 尾换行不增长（\\n 保持 \\n；one-off 留下的 \\n\\n 原样保持）", () => {
  const single = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: V2_TWO_NS });
  assert.ok(single.newTinyText.endsWith("field_1\tcount\n"));
  assert.ok(!single.newTinyText.endsWith("\n\n"), "单尾换行输入不得产出双尾换行");

  // one-off 缺陷③的产物形态：盘上 13 档 tiny 均以 \n\n 结尾（上游 v1 备份是 \n）。
  // 产品化重跑必须保持 \n\n 不变，否则 --force 永远无法 idempotent。
  const doubleInput = V1_LOSSY + "\n";
  const dbl = repairNamed({ tinyV1Text: doubleInput, v2TinyText: V2_TWO_NS });
  assert.ok(dbl.newTinyText.endsWith("\n\n"), "双尾换行原样保持");
  const re = repairNamed({ tinyV1Text: dbl.newTinyText, v2TinyText: V2_TWO_NS });
  assert.equal(re.changed, false, "\\n\\n 输入重跑同样 idempotent");
});

test("repairNamed: 3 命名空间 v2（mergedv2）同样能对齐修复", () => {
  const { newTinyText, stats, changed } = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: V2_THREE_NS });
  assert.equal(changed, true);
  assert.ok(newTinyText.split("\n")[4].endsWith("\tdoRun"));
  assert.equal(stats.memberFixed, 1, "3NS 夹具只有 method_1 一个成员");
});

test("repairNamed: v2 空 named 列不当有效名（防御：不把 v1 named 清成空串）", () => {
  const v2Empty = [
    "tiny\t2\t0\tintermediary\tnamed",
    "c\tnet/minecraft/class_1\t",
    "\tm\t()V\tmethod_1\t",
    "",
  ].join("\n");
  const { newTinyText, stats } = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: v2Empty });
  assert.ok(newTinyText.split("\n")[4].endsWith("\tmethod_1"), "v1 named 保持原样");
  assert.equal(stats.missClass, 3, "v2 空 named 的类全部计 miss");
  assert.equal(stats.memberFixed, 0);
});

// ── buildProvenance ──────────────────────────────────────────────────────────

test("buildProvenance: 数值字段是数字、URL 完整、sha 为 64 位十六进制、新字段为字符串", () => {
  const { stats } = repairNamed({ tinyV1Text: V1_LOSSY, v2TinyText: V2_TWO_NS });
  const repairedGz = zlib.gzipSync(Buffer.from("repaired-tiny", "utf8"));
  const prov = buildProvenance({
    tinyName: "yarn-1.2.3+build.4-tiny.gz",
    upstreamV1Sha256: sha256Hex(Buffer.from("v1-bytes")),
    upstreamV2Url: yarnV2JarUrls("1.2.3+build.4")[0],
    repairedGz,
    stats,
    now: new Date("2026-09-19T00:00:00Z"),
  });
  // 字段沿用现有 provenance 形状
  for (const key of ["repairedAt", "reason", "agent", "upstreamV1", "upstreamV2Used", "repairedSha256", "stats"]) {
    assert.ok(key in prov, `缺字段 ${key}`);
  }
  assert.equal(prov.repairedAt, "2026-09-19T00:00:00.000Z");
  assert.equal(prov.upstreamV1.file, "upstream/yarn-1.2.3+build.4-tiny.gz.v1-upstream.gz.bak");
  assert.match(prov.upstreamV1.sha256, /^[0-9a-f]{64}$/);
  assert.match(prov.repairedSha256, /^[0-9a-f]{64}$/);
  assert.equal(prov.repairedSha256, sha256Hex(repairedGz), "repairedSha256 必须是修复产物 gz 的 sha256");
  // 修缺陷①：upstreamV2Used 恒为完整 URL（one-off 缓存命中丢成 "cache"）
  assert.equal(
    prov.upstreamV2Used,
    "https://maven.fabricmc.net/net/fabricmc/yarn/1.2.3+build.4/yarn-1.2.3+build.4-mergedv2.jar",
  );
  // 修缺陷②：stats.missClass/missMember 数字（JSON.stringify 不再丢字段）
  assert.equal(typeof prov.stats.missClass, "number");
  assert.equal(typeof prov.stats.missMember, "number");
  assert.ok("missClass" in JSON.parse(JSON.stringify(prov.stats)), "序列化后 missClass 不得消失");
  // 新增字符串字段
  assert.equal(typeof prov.pipelineVersion, "string");
  assert.ok(prov.pipelineVersion.length > 0);
  assert.equal(prov.pipelineVersion, "repair-named-v2/1");
  assert.equal(typeof prov.formatVersion, "string");
  assert.equal(prov.formatVersion, "yarn-tiny-v1");
});

// ── yarnV2JarUrls / fetchV2Tiny（mock 网络）──────────────────────────────────

test("yarnV2JarUrls: mergedv2 优先回退 v2.jar；版本串过形态门", () => {
  const urls = yarnV2JarUrls("1.21.11+build.6");
  assert.deepEqual(urls, [
    "https://maven.fabricmc.net/net/fabricmc/yarn/1.21.11+build.6/yarn-1.21.11+build.6-mergedv2.jar",
    "https://maven.fabricmc.net/net/fabricmc/yarn/1.21.11+build.6/yarn-1.21.11+build.6-v2.jar",
  ]);
  assert.throws(() => yarnV2JarUrls("../evil"), /形态非法/);
  assert.throws(() => yarnV2JarUrls("1.2.3%2F.."), /形态非法/);
});

function mockResponse(status, body, buf) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => body ?? "",
    arrayBuffer: async () => (buf ?? Buffer.alloc(0)).buffer.slice((buf ?? Buffer.alloc(0)).byteOffset, (buf ?? Buffer.alloc(0)).byteOffset + (buf ?? Buffer.alloc(0)).byteLength),
  };
}

async function withMockFetch(impl, fn) {
  const orig = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return impl(String(url));
  };
  try {
    return await fn(calls);
  } finally {
    globalThis.fetch = orig;
  }
}

test("fetchV2Tiny: 下载 + sha256 sidecar 校验 + 缓存命中仍返回完整 URL（修缺陷①）", async () => {
  const jar = Buffer.from("fake-yarn-jar-bytes");
  const sha = sha256Hex(jar);
  const urls = yarnV2JarUrls("1.2.3+build.4");
  const cacheDir = mkdtempSync(path.join(tmpdir(), "yarncache-"));
  try {
    await withMockFetch(
      (s) => {
        if (s === `${urls[0]}.sha256`) return Promise.resolve(mockResponse(200, sha));
        if (s === urls[0]) return Promise.resolve(mockResponse(200, undefined, jar));
        return Promise.resolve(mockResponse(404));
      },
      async (calls) => {
        const r1 = await fetchV2Tiny({ version: "1.2.3+build.4", cacheDir });
        assert.equal(r1.url, urls[0]);
        assert.ok(r1.jarBuffer.equals(jar));
        assert.equal(calls.length, 2, "首次下载 = jar + sidecar 各一次");

        const r2 = await fetchV2Tiny({ version: "1.2.3+build.4", cacheDir });
        assert.equal(r2.url, urls[0], "缓存命中时 url 仍是完整 URL，不是 'cache'");
        assert.ok(r2.jarBuffer.equals(jar));
        assert.equal(calls.length, 2, "缓存命中不得再发网络请求");
      },
    );
  } finally {
    rmSync(cacheDir, { recursive: true, force: true });
  }
});

test("fetchV2Tiny: 缓存 sha 损坏时 TOFU 拒绝并重新下载覆盖", async () => {
  const jar = Buffer.from("fake-yarn-jar-bytes-2");
  const sha = sha256Hex(jar);
  const urls = yarnV2JarUrls("1.2.3+build.4");
  const cacheDir = mkdtempSync(path.join(tmpdir(), "yarncachebad-"));
  writeFileSync(path.join(cacheDir, "yarn-1.2.3+build.4-mergedv2.jar"), Buffer.from("corrupted"));
  writeFileSync(path.join(cacheDir, "yarn-1.2.3+build.4-mergedv2.jar.sha256"), `${"0".repeat(64)}\n`);
  try {
    await withMockFetch(
      (s) => {
        if (s === `${urls[0]}.sha256`) return Promise.resolve(mockResponse(200, sha));
        if (s === urls[0]) return Promise.resolve(mockResponse(200, undefined, jar));
        return Promise.resolve(mockResponse(404));
      },
      async (calls) => {
        const r = await fetchV2Tiny({ version: "1.2.3+build.4", cacheDir });
        assert.ok(r.jarBuffer.equals(jar), "坏缓存被重下覆盖");
        assert.equal(calls.length, 2);
        const r2 = await fetchV2Tiny({ version: "1.2.3+build.4", cacheDir });
        assert.ok(r2.jarBuffer.equals(jar));
        assert.equal(calls.length, 2, "修复后的缓存恢复命中");
      },
    );
  } finally {
    rmSync(cacheDir, { recursive: true, force: true });
  }
});

test("fetchV2Tiny: mergedv2 404 时回退 -v2.jar；无 sidecar 拒绝下载；sha 不匹配抛错；断网报错清晰", async () => {
  const jar = Buffer.from("v2-jar-bytes");
  const sha = sha256Hex(jar);
  const urls = yarnV2JarUrls("1.2.3+build.4");
  const cacheDir = mkdtempSync(path.join(tmpdir(), "yarncachefb-"));
  try {
    // mergedv2 404 → 回退 v2.jar
    await withMockFetch(
      (s) => {
        if (s === `${urls[1]}.sha256`) return Promise.resolve(mockResponse(200, sha));
        if (s === urls[1]) return Promise.resolve(mockResponse(200, undefined, jar));
        return Promise.resolve(mockResponse(404));
      },
      async () => {
        const r = await fetchV2Tiny({ version: "1.2.3+build.4", cacheDir });
        assert.equal(r.url, urls[1], "mergedv2 缺失时回退 -v2.jar");
      },
    );
    // jar 200 但 sidecar 404 → fail-closed（mirror yarn.ts MAPPINGS_CHECKSUM_MISSING）
    await withMockFetch(
      (s) => {
        if (s === urls[0]) return Promise.resolve(mockResponse(200, undefined, jar));
        return Promise.resolve(mockResponse(404));
      },
      async () => {
        await assert.rejects(fetchV2Tiny({ version: "1.2.3+build.4", cacheDir }), /拒绝无校验下载/);
      },
    );
    // sidecar 与 jar 字节不符 → 抛错
    await withMockFetch(
      (s) => {
        if (s === `${urls[0]}.sha256`) return Promise.resolve(mockResponse(200, `${"a".repeat(64)}\n`));
        if (s === urls[0]) return Promise.resolve(mockResponse(200, undefined, jar));
        return Promise.resolve(mockResponse(404));
      },
      async () => {
        await assert.rejects(fetchV2Tiny({ version: "1.2.3+build.4", cacheDir }), /sha256 校验失败/);
      },
    );
    // 无网络：两个候选都连接失败 → 清晰报错
    // （用无缓存的版本串 —— 同 cacheDir 里上面回退子例已缓存了 1.2.3 的 v2.jar，命中缓存会绕过网络）
    await withMockFetch(
      () => Promise.reject(new Error("getaddrinfo ENOTFOUND maven.fabricmc.net")),
      async () => {
        await assert.rejects(
          fetchV2Tiny({ version: "1.2.4+build.1", cacheDir }),
          /下载失败（无网络或 maven\.fabricmc\.net 不可达）.*ENOTFOUND/,
        );
      },
    );
    // 版本串形态非法 → 在任何网络请求前抛错
    await withMockFetch(
      () => Promise.resolve(mockResponse(200)),
      async (calls) => {
        await assert.rejects(fetchV2Tiny({ version: "../evil", cacheDir }), /形态非法/);
        assert.equal(calls.length, 0, "形态非法不得发出任何请求");
      },
    );
  } finally {
    rmSync(cacheDir, { recursive: true, force: true });
  }
});
