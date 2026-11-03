#!/usr/bin/env node
/**
 * gif.mjs — 把竖排帧图集（PNG）转成 GIF，用于在对话里直接预览动画。
 * 零依赖：GIF89a + LZW 自己编码。只支持图集模式（宽=帧宽，高=帧高×帧数）。
 *
 * 用法: node gif.mjs <atlas.png> <out.gif> [--delayCs 8] [--scale 4] [--bg #1a1822]
 */
import fs from "node:fs";
import zlib from "node:zlib";

/* ---------- PNG 解码 ---------- */
function decodePng(buf) {
  let p = 8, w = 0, h = 0, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const ty = buf.toString("ascii", p + 4, p + 8);
    const d = buf.slice(p + 8, p + 8 + len);
    if (ty === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); }
    else if (ty === "IDAT") idat.push(d);
    else if (ty === "IEND") break;
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * 4;
  const px = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    const s = raw.slice(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? px[y * stride + x - 4] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y > 0 ? px[(y - 1) * stride + x - 4] : 0;
      let v = s[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
  }
  return { w, h, px };
}

/* ---------- GIF 编码 ---------- */
function lzwEncode(indices, minCodeSize) {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let next = eoiCode + 1;
  const dict = new Map();
  const out = [];
  let cur = 0, curBits = 0;
  const emit = (code) => {
    cur |= code << curBits;
    curBits += codeSize;
    while (curBits >= 8) { out.push(cur & 255); cur >>= 8; curBits -= 8; }
  };
  const reset = () => { dict.clear(); next = eoiCode + 1; codeSize = minCodeSize + 1; };
  emit(clearCode);
  reset();
  let prefix = null;
  for (const k of indices) {
    if (prefix === null) { prefix = k; continue; }
    const key = prefix * 4096 + k;
    if (dict.has(key)) { prefix = dict.get(key); continue; }
    emit(prefix);
    if (next < 4096) { dict.set(key, next++); if (next > (1 << codeSize) && codeSize < 12) codeSize++; }
    else { emit(clearCode); reset(); }
    prefix = k;
  }
  if (prefix !== null) emit(prefix);
  emit(eoiCode);
  if (curBits > 0) out.push(cur & 255);
  return Buffer.from(out);
}

function buildGif(frames, w, h, delayCs, palette) {
  const parts = [];
  parts.push(Buffer.from("GIF89a", "ascii"));
  const lsd = Buffer.alloc(7);
  lsd.writeUInt16LE(w, 0); lsd.writeUInt16LE(h, 2);
  lsd[4] = 0xf7;  // 全局色表, 256 色
  lsd[5] = 0; lsd[6] = 0;
  parts.push(lsd);
  const gct = Buffer.alloc(768);
  for (let i = 0; i < 256; i++) {
    const c = palette[i] || [0, 0, 0];
    gct[i * 3] = c[0]; gct[i * 3 + 1] = c[1]; gct[i * 3 + 2] = c[2];
  }
  parts.push(gct);
  // Netscape loop
  parts.push(Buffer.from([0x21, 0xff, 0x0b, ...Buffer.from("NETSCAPE2.0", "ascii"), 0x03, 0x01, 0x00, 0x00, 0x00]));
  for (const idx of frames) {
    const gce = Buffer.from([0x21, 0xf9, 0x04, 0x00, delayCs & 255, (delayCs >> 8) & 255, 0x00, 0x00]);
    parts.push(gce);
    // Image Descriptor 固定 10 字节：0x2C + left(2) + top(2) + w(2) + h(2) + packed(1)
    const desc = Buffer.alloc(10);
    desc[0] = 0x2c;
    desc.writeUInt16LE(0, 1);   // left
    desc.writeUInt16LE(0, 3);   // top
    desc.writeUInt16LE(w, 5);   // width
    desc.writeUInt16LE(h, 7);   // height
    desc[9] = 0x00;             // packed: 无局部色表、非交错
    parts.push(desc);
    const data = lzwEncode(idx, 8);
    // LZW minimum code size + 子块序列 + 块终止符。
    // 顺序不能错：先写 minCodeSize，再是长度前缀子块，最后 0x00。
    const sub = [Buffer.from([8])];
    // 子块长度上限 255，但用 255 容易被个别解析器当成"长度=255 后接 1 字节"而错位，
    // 保守用 254，兼容性最好。
    for (let i = 0; i < data.length; i += 254) {
      const chunk = data.slice(i, i + 254);
      sub.push(Buffer.from([chunk.length]));
      sub.push(chunk);
    }
    sub.push(Buffer.from([0x00]));
    parts.push(Buffer.concat(sub));
  }
  parts.push(Buffer.from([0x3b]));
  return Buffer.concat(parts);
}

/* ---------- 主流程 ---------- */
const args = process.argv.slice(2);
if (args.length < 2) { console.error("用法: node gif.mjs <atlas.png> <out.gif> [--delayCs 8] [--scale 4] [--bg #1a1822]"); process.exit(2); }
const src = args[0], out = args[1];
function arg(n, d) { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; }
const delayCs = Number(arg("delayCs", 8));
const scale = Number(arg("scale", 4));
const bgHex = arg("bg", "#1a1822");
const bg = [parseInt(bgHex.slice(1,3),16), parseInt(bgHex.slice(3,5),16), parseInt(bgHex.slice(5,7),16)];

const { w, h, px } = decodePng(fs.readFileSync(src));
const fh = w;
const nFrames = Math.floor(h / fh);
const W = w * scale, H = fh * scale;

// 建立调色板（最多 256 色）
const pal = [bg];
const palIndex = new Map();
palIndex.set(bg.join(","), 0);
function idxOf(r, g, b) {
  const k = r + "," + g + "," + b;
  if (palIndex.has(k)) return palIndex.get(k);
  if (pal.length >= 256) return 0;
  pal.push([r, g, b]);
  palIndex.set(k, pal.length - 1);
  return pal.length - 1;
}

const frames = [];
for (let f = 0; f < nFrames; f++) {
  const idx = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = Math.floor(x / scale), sy = Math.floor(y / scale);
      const si = ((f * fh + sy) * w + sx) * 4;
      const a = px[si + 3];
      idx[y * W + x] = a === 0 ? 0 : idxOf(px[si], px[si + 1], px[si + 2]);
    }
  }
  frames.push(idx);
}

const gif = buildGif(frames, W, H, delayCs, pal);
fs.writeFileSync(out, gif);
console.log("[ok] " + nFrames + " 帧 " + w + "x" + fh + " → " + out + " (" + W + "x" + H + ", " + gif.length + " 字节, " + pal.length + " 色, delay " + delayCs + "cs)");