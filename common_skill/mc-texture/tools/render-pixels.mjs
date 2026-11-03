#!/usr/bin/env node
/**
 * render-pixels.mjs — 把「调色板 + 像素网格」文本渲染成 1× PNG。
 * 零依赖：PNG 用 node:zlib 手写，不插值、不抗锯齿、不缩放。
 *
 * 用法:
 *   node render-pixels.mjs <in.txt> --out <out.png> [--scale N] [--size 16x16]
 *   node render-pixels.mjs <in.txt> --out <out.png> --mcmeta [--frametime N] [--interpolate]
 *   node render-pixels.mjs <t.txt> <t.txt> ... --atlas <out.png> [--frametime N] [--interpolate]
 *
 * 动画（第 7 步）：
 *   --mcmeta    单帧文件带 --atlas 时装；对单图写 <out>.png.mcmeta
 *   --atlas     把多个同尺寸网格文件竖排拼成图集，并写 <out>.png.mcmeta
 *
 * 输入格式:
 *   # 注释
 *   a = #2b1a10   深棕描边
 *   . = transparent
 *   ........
 *   ..aaaa..
 *
 * . 恒为透明；调色板可写 #RRGGBB 或 #RRGGBBAA。
 * --scale 只做最近邻放大用于肉眼核对，不改原图。
 */
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";

const USAGE = [
  "用法:",
  "  node render-pixels.mjs <in.txt> --out <out.png> [--scale N] [--size 16x16]",
  "  node render-pixels.mjs <in.txt> --out <out.png> --mcmeta [--frametime N] [--interpolate]",
  "  node render-pixels.mjs a.txt b.txt c.txt --atlas <out.png> [--frametime N] [--interpolate]",
].join("\n");

function die(msg) {
  console.error("[render-pixels] " + msg);
  process.exit(1);
}

/* ---------- 解析 ---------- */

const PALETTE_RE = /^\s*(\S)\s*=\s*(#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?|transparent|none|透明)/;
const SEPARATOR_RE = /^\s*(?:-{3,}|palette|colors|grid|调色板|网格)\s*[:：]?\s*$/i;

function parseHex(hex) {
  const h = hex.slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255;
  return [r, g, b, a];
}

function parse(text) {
  const palette = new Map();
  const grid = [];
  const gridLines = [];
  const errors = [];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    if (t === "") continue;
    if (t.startsWith("#") || t.startsWith("//")) continue;
    if (SEPARATOR_RE.test(t)) continue;
    const pm = t.match(PALETTE_RE);
    if (pm) {
      const key = pm[1];
      const val = pm[2];
      // `. = 透明` 是文档里常见的写法，接受但不入表：. 恒为透明。
      if (key === ".") continue;
      if (palette.has(key)) errors.push("第 " + (i + 1) + " 行: 色号 " + key + " 重复定义");
      palette.set(key, /^#/.test(val) ? parseHex(val) : [0, 0, 0, 0]);
      continue;
    }
    if (/=/.test(t)) {
      errors.push("第 " + (i + 1) + " 行: 无法解析的调色板行 → " + t);
      continue;
    }
    grid.push(t);
    gridLines.push(i + 1);
  }

  return { palette, grid, gridLines, errors };
}

/* ---------- 校验 ---------- */

function validate(parsed, wantSize) {
  const { palette, grid, gridLines, errors } = parsed;
  const problems = [...errors];
  const warnings = [];

  if (palette.size === 0) problems.push("调色板为空：没有解析到任何 键 = #RRGGBB 行");
  if (grid.length === 0) problems.push("网格为空：没有解析到任何像素行");
  if (problems.length) return { problems, warnings, w: 0, h: 0 };

  const w = grid[0].length;
  const h = grid.length;

  for (let y = 0; y < h; y++) {
    if (grid[y].length !== w) {
      problems.push(
        "第 " + gridLines[y] + " 行: 长度 " + grid[y].length + "，与首行 " + w + " 不一致",
      );
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const ch = grid[y][x];
      if (ch === ".") continue;
      if (!palette.has(ch)) {
        problems.push("第 " + gridLines[y] + " 行第 " + (x + 1) + " 列: 色号 " + ch + " 未在调色板定义");
      }
    }
  }

  if (wantSize) {
    if (!/^\d+x\d+$/.test(wantSize)) problems.push("--size 须写成 WxH，收到 " + wantSize);
    else {
      const parts = wantSize.split("x").map(Number);
      if (parts[0] !== w || parts[1] !== h) {
        problems.push("尺寸不符: 实际 " + w + "x" + h + "，要求 " + wantSize);
      }
    }
  }

  // 孤立像素: 非透明且四邻全透明
  let isolated = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[y][x] === ".") continue;
      const up = y > 0 ? grid[y - 1][x] : ".";
      const dn = y < h - 1 ? grid[y + 1][x] : ".";
      const lf = x > 0 ? grid[y][x - 1] : ".";
      const rt = x < w - 1 ? grid[y][x + 1] : ".";
      if (up === "." && dn === "." && lf === "." && rt === ".") isolated++;
    }
  }
  if (isolated > 0) warnings.push("有 " + isolated + " 个孤立像素（四邻全透明）—— 多半是不小心点上去的");

  // 半透明检测
  for (const [k, v] of palette) {
    if (v[3] !== 0 && v[3] !== 255) warnings.push("色号 " + k + " 的 alpha=" + v[3] + "，不是 0/255 —— 像素画应避免半透明");
  }

  return { problems, warnings, w, h };
}

/* ---------- PNG ---------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function scaleNearest(w, h, rgba, n) {
  const W = w * n;
  const H = h * n;
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    const sy = Math.floor(y / n);
    for (let x = 0; x < W; x++) {
      const sx = Math.floor(x / n);
      const si = (sy * w + sx) * 4;
      const di = (y * W + x) * 4;
      out[di] = rgba[si];
      out[di + 1] = rgba[si + 1];
      out[di + 2] = rgba[si + 2];
      out[di + 3] = rgba[si + 3];
    }
  }
  return { W, H, out };
}

/* ---------- main ---------- */

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
  console.log(USAGE);
  process.exit(argv.length === 0 ? 2 : 0);
}

let inputs = [];
let out = null;
let scale = 0;
let wantSize = null;
let atlas = null;
let mcmeta = false;
let frametime = 1;
let interpolate = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--out" || a === "-o") out = argv[++i];
  else if (a === "--scale" || a === "-s") scale = Number(argv[++i]);
  else if (a === "--size") wantSize = argv[++i];
  else if (a === "--atlas") atlas = argv[++i];
  else if (a === "--mcmeta") mcmeta = true;
  else if (a === "--frametime") frametime = Number(argv[++i]);
  else if (a === "--interpolate") interpolate = true;
  else if (!a.startsWith("-")) inputs.push(a);
  else die("无法识别的参数: " + a + "\n" + USAGE);
}

if (inputs.length === 0) die("缺少输入文件\n" + USAGE);
for (const f of inputs) if (!fs.existsSync(f)) die("输入文件不存在: " + f);
if (atlas !== null) out = atlas;
if (!out) {
  if (inputs.length > 1) die("多文件模式必须给 --out\n" + USAGE);
  out = inputs[0].replace(/\.txt$/i, "") + ".png";
}
if (scale && (!Number.isInteger(scale) || scale < 1)) die("--scale 须为正整数");
if (!Number.isInteger(frametime) || frametime < 1) die("--frametime 须为 >=1 的整数");

/** 把一份网格文本转成 RGBA buffer（校验已在调用前做过）。 */
function gridToRgba(p) {
  const pw = p.grid[0].length;
  const ph = p.grid.length;
  const buf = Buffer.alloc(pw * ph * 4);
  const usedKeys = new Set();
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      const ch = p.grid[y][x];
      if (ch === ".") continue;
      const c = p.palette.get(ch);
      const di = (y * pw + x) * 4;
      buf[di] = c[0];
      buf[di + 1] = c[1];
      buf[di + 2] = c[2];
      buf[di + 3] = c[3];
      usedKeys.add(ch);
    }
  }
  return { w: pw, h: ph, rgba: buf, used: usedKeys };
}

/** 竖排拼接：所有帧尺寸必须一致。 */
function stackVertical(frames) {
  const w = frames[0].w;
  const fh = frames[0].h;
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].w !== w || frames[i].h !== fh) {
      die("第 " + (i + 1) + " 帧尺寸 " + frames[i].w + "x" + frames[i].h + " 与首帧 " + w + "x" + fh + " 不一致，无法拼图集");
    }
  }
  const H = fh * frames.length;
  const out = Buffer.alloc(w * H * 4);
  frames.forEach((f, i) => f.rgba.copy(out, i * fh * w * 4));
  return { w, h: H, rgba: out, frameH: fh, frames: frames.length };
}

function writeMcmeta(pngPath, frameCount, frameH) {
  const meta = { animation: { frametime, interpolate, frames: Array.from({ length: frameCount }, (_, k) => k) } };
  if (frameH) { meta.animation.width = undefined; meta.animation.height = frameH; }
  const clean = { animation: { frametime, interpolate, frames: meta.animation.frames } };
  clean.animation.height = frameH;
  const p = pngPath + ".mcmeta";
  fs.writeFileSync(p, JSON.stringify(clean, null, 2) + "\n");
  return p;
}

/* ---------- 多帧 → 图集 ---------- */

if (inputs.length > 1) {
  const frames = [];
  for (const f of inputs) {
    const p = parse(fs.readFileSync(f, "utf8"));
    const v = validate(p, wantSize);
    for (const wm of v.warnings) console.warn("[warn] " + f + ": " + wm);
    if (v.problems.length) {
      for (const pr of v.problems) console.error("[error] " + f + ": " + pr);
      die(f + " 校验不通过，未写出图集");
    }
    frames.push(gridToRgba(p));
  }
  const st = stackVertical(frames);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  const png = encodePng(st.w, st.h, st.rgba);
  fs.writeFileSync(out, png);
  console.log("[ok] 图集 " + st.w + "x" + st.h + " = " + st.frames + " 帧 " + st.w + "x" + st.frameH + " → " + out + " (" + png.length + " 字节)");
  const mp = writeMcmeta(out, st.frames, st.frameH);
  console.log("[ok] mcmeta → " + mp + " (frametime=" + frametime + ", interpolate=" + interpolate + ")");
  process.exit(0);
}

const input = inputs[0];

const parsed = parse(fs.readFileSync(input, "utf8"));
const { problems, warnings, w, h } = validate(parsed, wantSize);

for (const wmsg of warnings) console.warn("[warn] " + wmsg);
if (problems.length) {
  for (const p of problems) console.error("[error] " + p);
  die(problems.length + " 项校验不通过，未写出文件");
}

const rgba = Buffer.alloc(w * h * 4);
const used = new Set();
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const ch = parsed.grid[y][x];
    const di = (y * w + x) * 4;
    if (ch === ".") continue;
    const c = parsed.palette.get(ch);
    rgba[di] = c[0];
    rgba[di + 1] = c[1];
    rgba[di + 2] = c[2];
    rgba[di + 3] = c[3];
    used.add(ch);
  }
}

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const png = encodePng(w, h, rgba);
fs.writeFileSync(out, png);
console.log("[ok] " + w + "x" + h + " → " + out + " (" + png.length + " 字节, " + used.size + " 色)");

if (scale && scale > 1) {
  const s = scaleNearest(w, h, rgba, scale);
  const big = encodePng(s.W, s.H, s.out);
  const bigPath = out.replace(/\.png$/i, "") + "@" + scale + "x.png";
  fs.writeFileSync(bigPath, big);
  console.log("[ok] 预览 " + s.W + "x" + s.H + " → " + bigPath + " (" + big.length + " 字节, 最近邻放大 " + scale + " 倍)");
}

if (mcmeta) {
  // 单图当「1 帧动画」写 mcmeta —— 一般用于给已有单帧贴图补动画声明。
  const clean = { animation: { frametime, interpolate, frames: [0], height: h } };
  const mp = out + ".mcmeta";
  fs.writeFileSync(mp, JSON.stringify(clean, null, 2) + "\n");
  console.log("[ok] mcmeta → " + mp + " (frametime=" + frametime + ", interpolate=" + interpolate + ")");
}