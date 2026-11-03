#!/usr/bin/env node
/**
 * firework.mjs — 按 MC 烟花机制生成像素烟花动画（图集 + .png.mcmeta）。
 * 零依赖：PNG 用 node:zlib 手写。
 *
 * MC 依据（官方语料 resources_server_loottables_lootfunctions.md:1009-1011）：
 *   shape 合法值 = small_ball | large_ball | star | creeper | burst，缺省 small_ball
 *   另有 trail（拖尾）与 flicker（闪烁）两个附加效果
 *
 * 每帧由规则算出，不是手画：粒子按球面分层抽样均匀分布 → 抛物线运动 → 按年龄着色。
 *
 * 用法:
 *   node firework.mjs <outdir> [--shape star] [--fps 12] [--size 32] [--colors #ff5555,#ffd700]
 *                    [--trail] [--flicker] [--seed 7] [--scale 8]
 */
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";

/* ---------- 随机（带种子，结果可复现） ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- PNG ---------- */
const CRC = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(ty, data) { const l = Buffer.alloc(4); l.writeUInt32BE(data.length, 0); const body = Buffer.concat([Buffer.from(ty, "ascii"), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(body), 0); return Buffer.concat([l, body, c]); }
function encodePng(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  const stride = w * 4; const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); }
  return Buffer.concat([sig, chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

/* ---------- 参数 ---------- */
const args = process.argv.slice(2);
if (args.length === 0) { console.error("用法: node firework.mjs <outdir> [--shape star|small_ball|large_ball|creeper|burst] [--fps 12] [--size 32] [--seed 7] [--trail] [--flicker]"); process.exit(2); }
const outDir = args[0];
function arg(name, dflt) { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : dflt; }
function flag(name) { return args.includes("--" + name); }

const SHAPES = ["small_ball", "large_ball", "star", "creeper", "burst"];
const shape = arg("shape", "star");
if (!SHAPES.includes(shape)) { console.error("shape 必须是 " + SHAPES.join(" | ") + "，收到 " + shape); process.exit(1); }
const fps = Number(arg("fps", 12));
const SIZE = Number(arg("size", 32));
const seed = Number(arg("seed", 7));
const trail = flag("trail");
const flicker = flag("flicker");
const scale = Number(arg("scale", 8));
const colorsArg = arg("colors", null);

/* ---------- 调色板 ---------- */
// 烟花用 MC 染料色系；每颗星两种颜色（主色 + 渐隐色）
const DYE = {
  white: "#f9fffe", red: "#ff5555", orange: "#ffaa00", yellow: "#ffff55",
  lime: "#80ff20", green: "#3fbf3f", cyan: "#3fd6d6", blue: "#5a7cff",
  purple: "#b45aff", magenta: "#ff7cd8", pink: "#ffb8d0", gold: "#ffd700",
};
const palette = ["#ffffff", "#fff6c8", "#ffd700", "#ffaa00", "#ff5555", "#c43f3f", "#5a3c78"];
const FADE = ["#a8c0ff", "#8a9ef0"];
// 火色阶（默认）；creeper 用绿色阶 —— 苦力怕烟花在 MC 里是绿色染料
const FIRE = { core: "#ffffff", hot: "#fff6c8", warm: "#ffd700", mid: "#ffaa00", cool: "#ff5555", dim: "#c43f3f", dead: "#5a3c78" };
const GREEN = { core: "#f2fff4", hot: "#d8ffdd", warm: "#9dff9d", mid: "#4fd45f", cool: "#2f9e46", dim: "#1d6b30", dead: "#144a24" };
const COL = shape === "creeper" ? GREEN : FIRE;

/* ---------- 形状规则 ---------- */
// MC 五种形状（官方语料 resources_server_loottables_lootfunctions.md:1009-1011）
// small_ball / large_ball = 均匀球壳；star = 放射光芒；creeper = 苦力怕脸；burst = 球壳但带不规则密度
// 每种形状返回 N 个单位方向（已归一化）。
function directions(n, rnd) {
  const out = [];
  if (shape === "small_ball" || shape === "large_ball") {
    // 均匀球面：等面积分层（Fibonacci 球），不会两极扎堆
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n;
      const phi = Math.acos(1 - 2 * u);
      const theta = i * 2.399963229728653;
      out.push([Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)]);
    }
  } else if (shape === "star") {
    // 星形：连续的角度分布（不是几个离散簇），8 条光芒由"半径倍数"体现——
    // 落在光芒角度附近的粒子飞得更远，其余飞得近，形成星芒轮廓而不是 8 个点。
    const RAYS = 8;
    for (let i = 0; i < n; i++) {
      // 角度用黄金角铺满整圈，保证连续无缝
      const a = i * 2.399963229728653;
      const elev = (rnd() - 0.5) * 0.30;
      const v = [Math.cos(a) * Math.cos(elev), Math.sin(a) * Math.cos(elev), Math.sin(elev)];
      // 标记这颗星是否为"光芒尖"：角度接近 8 等分点时拉长
      const near = Math.abs(((a % (Math.PI * 2)) / (Math.PI / 4)) - Math.round((a % (Math.PI * 2)) / (Math.PI / 4)));
      const isTip = near < 0.18;
      out.push(v);
      out.rayTip = out.rayTip || [];
      out.rayTip.push(isTip);
    }
    out.tips = true;
  } else if (shape === "creeper") {
    // 苦力怕脸：粒子方向直接来自 16×16 脸谱遮罩。不做球面归一化 ——
    // 归一化会把平面压成球面、把脸挤到一角。这里保留平面比例，
    // 让 dx/dy 落在 [-1,1] 的方形里，dz 只用来分层。
    const MASK = [
      "................", "................", "................", "................",
      "....XX....XX....", "....XX....XX....", "....XX....XX....", "....XXXXXXXX....",
      "....XXXXXXXX....", "....XX.XX.XX....", "....XX.XX.XX....", "....XX.XX.XX....",
      "....XXXXXXXX....", "....XXXXXXXX....", "................", "................",
    ];
    const cells = [];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if (MASK[y][x] === "X") cells.push([x, y]);
    }
    for (let i = 0; i < n; i++) {
      const c = cells[i % cells.length];
      const layer = Math.floor(i / cells.length);
      // 抖动必须小：脸靠轮廓辨认，抖动一大就糊成一团绿云
      const jx = (rnd() - 0.5) * 0.16;
      const jy = (rnd() - 0.5) * 0.16;
      // 不做归一化，直接给平面方向；长度 ≈1 的仍是球，脸在中心
      let nx = (c[0] + 0.5 + jx - 8) / 7.2;
      let ny = (c[1] + 0.5 + jy - 8) / 7.2;
      // 限制在单位圆内，避免四角被裁
      const rr = Math.hypot(nx, ny);
      if (rr > 1) { nx /= rr; ny /= rr; }
      out.push([nx, ny, 0.25 + layer * 0.18]);
    }
  } else {
    // burst：球壳 + 不规则密度
    for (let i = 0; i < n; i++) {
      const u = rnd() < 0.5 ? rnd() : (i + 0.5) / n;
      const phi = Math.acos(1 - 2 * u);
      const theta = rnd() * Math.PI * 2;
      out.push([Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)]);
    }
  }
  return out;
}

/* ---------- 生成粒子 ---------- */
// 关键：同一方向上必须铺开不同距离，否则所有粒子叠成一个点（"一串珠子"）。
// 做法 = 方向分层 + 每个方向多个壳层（shell），壳层半径错开。
const rnd = mulberry32(seed);
const SHELLS = shape === "large_ball" ? 5 : shape === "small_ball" ? 4 : 4;
const PER_DIR = shape === "large_ball" ? 40 : shape === "small_ball" ? 32 : shape === "creeper" ? 90 : 48;
const N = SHELLS * PER_DIR;
const dirs = directions(N, rnd);
const tips = dirs.rayTip || null;
const speedBase = shape === "large_ball" ? 1.25 : 1.0;
const particles = dirs.map((d, i) => {
  const shell = i % SHELLS;               // 第几层壳
  const shellT = (shell + 1) / SHELLS;    // 0.25 / 0.5 / 0.75 / 1.0
  return {
    dx: d[0], dy: d[1], dz: d[2],
    // 速度分三档：内层慢、外层快，形成有厚度的球壳而不是一个点
    // 星芒尖上飞得更远，形成光芒；其余收缩成球心
    // creeper 的脸必须整片一起扩张，壳层差异会把它揉成一团 ⇒ 该形状所有粒子同速
    v: shape === "creeper"
      ? (0.80 + rnd() * 0.10)
      : speedBase * (0.45 + shellT * 0.85) * (0.92 + rnd() * 0.16) * (tips && tips[i] ? 1.55 : 0.78),
    phase: rnd() * Math.PI * 2,
    life: 0.62 + rnd() * 0.38,
    jitter: (rnd() - 0.5) * 0.6,          // 每颗粒子的小偏移，避免整齐排列
    z: d[2],
  };
});

/* ---------- 渲染一帧 ---------- */
const cx = SIZE / 2 - 0.5, cy = SIZE / 2 - 0.5;
// creeper 是"脸"，靠少扩张保持轮廓；其它形状是球，扩散越大越有爆发感
const SPEED = SIZE * (shape === "creeper" ? 0.155 : 0.30);

// 经典苦力怕脸 16×16。'#' = 脸的绿色区域，'X' = 眼睛/嘴（深色负空间）。
// 关键：眼和嘴是"挖掉"的，不是"画上去"的 —— 反了就成了笑脸。
const CREEPER_FACE = [
  "################",
  "##XXXX####XXXX##",
  "##XXXX####XXXX##",
  "##XXXX####XXXX##",
  "######XXXX######",
  "######XXXX######",
  "##XXXXXXXXXXXX##",
  "##XXXXXXXXXXXX##",
  "##XX##XXXX##XX##",
  "##XX##XXXX##XX##",
  "##XX##XXXX##XX##",
  "##XX##XXXX##XX##",
  "##XXXXXXXXXXXX##",
  "##XXXXXXXXXXXX##",
  "################",
  "################",
];

function renderFrame(t) {
  const px = new Array(SIZE * SIZE).fill(null);
  const put = (x, y, c) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
    const k = y * SIZE + x;
    if (!px[k]) px[k] = c;
  };

  // 中心闪光：爆炸瞬间
  if (t < 0.14) {
    const r = 1 - t / 0.14;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const dist = Math.hypot(dx, dy);
      if (dist <= 3 * r + 0.6) put(cx + dx, cy + dy, dist < 1.2 ? COL.core : COL.hot);
    }
  }

  // ---- creeper：直接按遮罩栅格画脸，粒子只负责边缘散逸 ----
  // 粒子法做不出可辨认的脸：粒子大小/抖动/拖尾都会把轮廓糊掉。
  // 脸的辨识度来自"方眼 + 方嘴"，只有栅格能保证。
  if (shape === "creeper") {
    const grow = Math.min(1, t / 0.16);                  // 出场：0→1 放大
    const fadeT = Math.max(0, (t - 0.55) / 0.42);        // 0.55s 后开始散
    const cellPx = (SIZE * 0.72) / 16;                    // 一格里多少像素
    const ox = cx - (SIZE * 0.72) / 2;
    const oy = cy - (SIZE * 0.72) / 2;

    for (let gy = 0; gy < 16; gy++) {
      for (let gx = 0; gx < 16; gx++) {
        if (CREEPER_FACE[gy][gx] !== "#") continue;   // 只画脸，眼嘴留空
        // 每格随时间向外散开
        const dxg = (gx - 7.5) / 8;
        const dyg = (gy - 7.5) / 8;
        const spread = fadeT * fadeT * SIZE * 0.55;
        const bx = Math.round(ox + gx * cellPx * grow + dxg * spread);
        const by = Math.round(oy + gy * cellPx * grow + dyg * spread * 0.8);
        // 格子必须画满相邻（+1 消除缝隙），否则脸会散成一个个方点、看不出是眼和嘴
        const cw = Math.max(1, Math.ceil(cellPx * grow * (1 - fadeT * 0.55)));
        // 颜色随扩散降温
        let c = COL.mid;
        if (t < 0.10) c = COL.core;
        else if (t < 0.22) c = COL.hot;
        else if (t < 0.42) c = COL.warm;
        else if (fadeT > 0.55) c = COL.dim;
        // flicker：后期的格子随机闪
        if (flicker && fadeT > 0.35) {
          const h = Math.abs(Math.sin(gx * 12.9898 + gy * 78.233 + Math.floor(t * 12) * 4.1)) * 43758.5453;
          if (h - Math.floor(h) > 0.55) continue;
        }
        for (let py = 0; py < cw; py++) for (let pxi = 0; pxi < cw; pxi++) {
          put(bx + pxi, by + py, c);
        }
      }
    }
    // 中心辉光
    if (t < 0.30) {
      const glow = 1 - t / 0.30;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        if (Math.hypot(dx, dy) <= 0.9 + glow * 1.2) put(cx + dx, cy + dy, COL.core);
      }
    }
    return px;
  }

  for (const p of particles) {
    const age = t / p.life;
    if (age > 1) continue;
    const ease = 1 - Math.pow(1 - Math.min(age, 1), 2.2);
    const r = ease * SPEED * p.v;
    const x = cx + p.dx * r;
    const y = cy + p.dy * r + age * age * SIZE * 0.14; // 重力下坠

    // 颜色按【已飞出的距离】而不是年龄：近处亮白，远处才降温。
    // 这样球心不会先空出来 —— 那是"空心环"的成因。
    const dist = r / (SPEED * 1.5);
    let c;
    if (dist < 0.07) c = COL.core;
    else if (dist < 0.20) c = COL.hot;
    else if (dist < 0.40) c = COL.warm;
    else if (dist < 0.60) c = COL.mid;
    else if (dist < 0.80) c = COL.cool;
    else c = COL.dim;

    if (age > 0.82) c = COL.dead;
    if (flicker && age > 0.45 && Math.sin(p.phase + t * 38) > 0.45) continue;

    put(x, y, c);

    if (trail && age > 0.12) {
      const steps = 3;
      for (let s = 1; s <= steps; s++) {
        const rr = r * (1 - s * 0.055);
        if (rr <= 0) continue;
        put(cx + p.dx * rr, cy + p.dy * rr + (age * (1 - s * 0.05)) ** 2 * SIZE * 0.14, COL.dead);
      }
    }
  }

  // 持续的中心辉光：球心始终有一点亮，避免"空心环"
  if (t < 0.42) {
    const glow = 1 - t / 0.42;
    const gr = 0.8 + glow * 1.1;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      if (Math.hypot(dx, dy) <= gr) put(cx + dx, cy + dy, glow > 0.6 ? COL.core : COL.hot);
    }
  }

  return px;
}

/* ---------- 颜色解析 ---------- */
function hex(c) { return [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16), 255]; }
const colorMap = new Map();
for (const [k, v] of Object.entries(COL)) colorMap.set(v, hex(v));

/* ---------- 输出 ---------- */
const DUR = 1.15;
const frames = [];
const frameCount = Math.round(DUR * fps);
for (let f = 0; f < frameCount; f++) frames.push(renderFrame((f / fps)));

// 去掉尾部全空帧
while (frames.length && frames[frames.length - 1].every((c) => c === null)) frames.pop();
if (frames.length === 0) { console.error("没有任何一帧有内容，检查参数"); process.exit(1); }

fs.mkdirSync(outDir, { recursive: true });
const W = SIZE, H = SIZE * frames.length;
const atlas = Buffer.alloc(W * H * 4);
let totalPx = 0;
frames.forEach((fr, fi) => {
  for (let i = 0; i < fr.length; i++) {
    if (!fr[i]) continue;
    const c = colorMap.get(fr[i]);
    const o = (fi * SIZE * SIZE + i) * 4;
    atlas[o] = c[0]; atlas[o+1] = c[1]; atlas[o+2] = c[2]; atlas[o+3] = c[3];
    totalPx++;
  }
});
const atlasPath = path.join(outDir, "firework.png");
fs.writeFileSync(atlasPath, encodePng(W, H, atlas));
const meta = { animation: { frametime: Math.max(1, Math.round(20 / fps)), interpolate: false, frames: frames.map((_, i) => i), width: SIZE, height: SIZE } };
fs.writeFileSync(atlasPath + ".mcmeta", JSON.stringify(meta, null, 2) + "\n");

console.log("[ok] 形状 " + shape + " | " + W + "x" + H + " = " + frames.length + " 帧 " + W + "x" + SIZE + " | " + totalPx + " 像素");
console.log("[ok] 图集 → " + atlasPath);
console.log("[ok] mcmeta → " + atlasPath + ".mcmeta (frametime=" + meta.animation.frametime + ")");
console.log("[ok] trail=" + trail + " flicker=" + flicker + " seed=" + seed);

// 放大预览
if (scale > 1) {
  const P = scale;
  const W2 = W * P, H2 = H * P;
  const big = Buffer.alloc(W2 * H2 * 4);
  for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
    const sx = Math.floor(x / P), sy = Math.floor(y / P);
    const si = (sy * W + sx) * 4, di = (y * W2 + x) * 4;
    big[di] = atlas[si]; big[di+1] = atlas[si+1]; big[di+2] = atlas[si+2]; big[di+3] = atlas[si+3];
    if (atlas[si+3] === 0) { big[di] = 30; big[di+1] = 30; big[di+2] = 40; big[di+3] = 255; }
  }
  const pp = path.join(outDir, "firework@" + P + "x.png");
  fs.writeFileSync(pp, encodePng(W2, H2, big));
  console.log("[ok] 预览 → " + pp);
}