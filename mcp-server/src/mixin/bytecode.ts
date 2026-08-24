/**
 * T4 字节码层：最小 classfile 解析器（零外部依赖，Buffer 直读，JVM 规范 §4）。
 *
 * 覆盖：
 * - 常量池 tags 1/3/4/5/6/7/8/9/10/11/12/15/16/17/18/19/20
 * - fields / methods（access_flags + name/descriptor 来自常量池）
 * - superClass / interfaces
 * - class 级 Record 属性 → recordComponents
 * - 每个方法 Code 属性 → 轻量反汇编（opcode 流 + INVOKE 系 / GETFIELD / PUTFIELD 调用点）
 *   （wide / tableswitch / lookupswitch 对齐处理）
 *
 * 用途：mixin_analyze deep 模式 / validate_at / validate_aw 的字节码索引层。
 */

import { readFileSync, statSync } from "fs";
import { readZip } from "../decompile/zip-util.js";

export interface ClassMethod {
  name: string;
  descriptor: string;
  accessFlags: number;
}

export interface ClassField {
  name: string;
  descriptor: string;
  accessFlags: number;
}

export interface RecordComponent {
  name: string;
  descriptor: string;
}

export interface ClassMemberRef {
  owner: string;
  name: string;
  desc: string;
}

export interface CallSite {
  opcode: number;
  target: ClassMemberRef;
}

export interface ClassInfo {
  /** 内部斜杠形式（如 com/example/Fixture） */
  className: string;
  accessFlags: number;
  superName?: string;
  interfaces: string[];
  methods: ClassMethod[];
  fields: ClassField[];
  recordComponents: RecordComponent[];
  /** key = name+descriptor（如 apply()V）→ 该方法体的 opcode 序列 */
  methodCodes: Map<string, number[]>;
  /** key = name+descriptor → 方法体内的调用点（INVOKE 系 / GETFIELD / PUTFIELD） */
  calls: Map<string, CallSite[]>;
}

export class ClassFormatError extends Error {
  constructor(message: string) {
    super(`classfile 解析失败: ${message}`);
  }
}

/** 边界预检：读之前确认 [pos, pos+n) 在缓冲区内；截断/畸形文件抛 ClassFormatError 而非裸 RangeError。 */
function needBuf(buf: Buffer, pos: number, n: number, what: string): void {
  if (pos < 0 || pos + n > buf.length) {
    throw new ClassFormatError(`${what}越界（@${pos}+${n} > ${buf.length}）——文件被截断或构造`);
  }
}

// ── 常量池 ─────────────────────────────────────────────────────────────────────

interface CpEntry {
  tag: number;
  /** Utf8: 字符串；Class/String: 索引；NameAndType: nameIndex/descIndex；Methodref 等: classIndex/ntIndex */
  str?: string;
  idx1?: number;
  idx2?: number;
}

class Cp {
  entries: CpEntry[] = [];
  /** 常量池结束位置（池后的第一个字节） */
  end: number;
  constructor(buf: Buffer, start: number, count: number) {
    let pos = start;
    for (let i = 1; i < count; i++) {
      needBuf(buf, pos, 1, `常量池 #${i} tag`);
      const tag = buf[pos];
      pos += 1;
      switch (tag) {
        case 1: {
          needBuf(buf, pos, 2, `常量池 #${i} Utf8 长度`);
          const len = buf.readUInt16BE(pos);
          pos += 2;
          needBuf(buf, pos, len, `常量池 #${i} Utf8 内容`);
          this.entries.push({ tag, str: buf.toString("utf8", pos, pos + len) });
          pos += len;
          break;
        }
        case 3:
        case 4:
          needBuf(buf, pos, 4, `常量池 #${i}`);
          this.entries.push({ tag });
          pos += 4;
          break;
        case 5:
        case 6:
          // long/double 占两个槽位
          needBuf(buf, pos, 8, `常量池 #${i}`);
          this.entries.push({ tag });
          pos += 8;
          i += 1;
          break;
        case 7:
        case 8:
        case 16:
        case 19:
        case 20:
          needBuf(buf, pos, 2, `常量池 #${i}`);
          this.entries.push({ tag, idx1: buf.readUInt16BE(pos) });
          pos += 2;
          break;
        case 9:
        case 10:
        case 11:
        case 12:
        case 17:
        case 18:
          needBuf(buf, pos, 4, `常量池 #${i}`);
          this.entries.push({ tag, idx1: buf.readUInt16BE(pos), idx2: buf.readUInt16BE(pos + 2) });
          pos += 4;
          break;
        case 15:
          needBuf(buf, pos, 3, `常量池 #${i}`);
          this.entries.push({ tag, idx1: buf[pos], idx2: buf.readUInt16BE(pos + 1) });
          pos += 3;
          break;
        default:
          throw new ClassFormatError(`未知常量池 tag ${tag}（@${i}）`);
      }
    }
    this.end = pos;
  }
  /** 1-based 索引 → 条目（越界/空槽返回 undefined） */
  at(index: number): CpEntry | undefined {
    return this.entries[index - 1];
  }
  utf8(index: number): string {
    const e = this.at(index);
    if (!e || e.tag !== 1 || e.str === undefined) {
      throw new ClassFormatError(`常量池 #${index} 非 Utf8`);
    }
    return e.str;
  }
  className(index: number): string {
    const e = this.at(index);
    if (!e || e.tag !== 7 || e.idx1 === undefined) {
      throw new ClassFormatError(`常量池 #${index} 非 Class`);
    }
    return this.utf8(e.idx1);
  }
  nameType(index: number): { name: string; desc: string } {
    const e = this.at(index);
    if (!e || e.tag !== 12 || e.idx1 === undefined || e.idx2 === undefined) {
      throw new ClassFormatError(`常量池 #${index} 非 NameAndType`);
    }
    return { name: this.utf8(e.idx1), desc: this.utf8(e.idx2) };
  }
  memberRef(index: number, tag: number): ClassMemberRef {
    const e = this.at(index);
    if (!e || e.tag !== tag || e.idx1 === undefined || e.idx2 === undefined) {
      throw new ClassFormatError(`常量池 #${index} 非 member ref (tag ${tag})`);
    }
    return { owner: this.className(e.idx1), ...this.nameType(e.idx2) };
  }
}

// ── 轻量反汇编（足以定位 INVOKE*/GETFIELD/PUTFIELD/LDC 的操作数长度）────────────

/** 固定操作数长度表（opcode → 操作数字节数；特殊指令单独处理） */
const OP_SIZES = new Uint8Array(256);
for (let i = 0; i < 256; i++) OP_SIZES[i] = 0;
const SET: Array<[number, number]> = [
  [0x10, 1], [0x11, 2], [0x12, 1], [0x13, 2], [0x14, 2],
  [0x15, 1], [0x16, 1], [0x17, 1], [0x18, 1], [0x19, 1],
  [0x36, 1], [0x37, 1], [0x38, 1], [0x39, 1], [0x3a, 1],
  [0x84, 2], // iinc
  [0x99, 2], [0x9a, 2], [0x9b, 2], [0x9c, 2], [0x9d, 2], [0x9e, 2],
  [0x9f, 2], [0xa0, 2], [0xa1, 2], [0xa2, 2], [0xa3, 2], [0xa4, 2],
  [0xa5, 2], [0xa6, 2], [0xa7, 2], [0xa8, 2],
  [0xa9, 1], // ret
  [0xb2, 2], [0xb3, 2], [0xb4, 2], [0xb5, 2], // getstatic/putstatic/getfield/putfield
  [0xb6, 2], [0xb7, 2], [0xb8, 2], // invokevirtual/special/static
  [0xb9, 4], [0xba, 4], // invokeinterface/invokedynamic
  [0xbb, 2], // new
  [0xbc, 1], // newarray
  [0xbd, 2], // anewarray
  [0xc0, 2], [0xc1, 2], // checkcast/instanceof
  [0xc5, 3], // multianewarray
  [0xc6, 2], [0xc7, 2],
  [0xc8, 4], [0xc9, 4], // goto_w / jsr_w
];
for (const [op, n] of SET) OP_SIZES[op] = n;

/** 跳转/对齐辅助 */
function align4(pos: number): number {
  return (pos + 3) & ~3;
}

function disassemble(code: Buffer, cp: Cp): { opcodes: number[]; calls: CallSite[] } {
  const opcodes: number[] = [];
  const calls: CallSite[] = [];
  let pos = 0;
  const len = code.length;
  const insnLimit = len + 1;
  let insnCount = 0;
  while (pos < len) {
    const start = pos;
    insnCount += 1;
    if (insnCount > insnLimit) throw new ClassFormatError("指令数超过上限");
    const op = code[pos];
    opcodes.push(op);
    pos += 1;

    // 字段/方法引用 → 调用点（操作数 2 字节，先预检再读，防贴边 RangeError）
    if (op === 0xb2 || op === 0xb3 || op === 0xb4 || op === 0xb5) {
      needBuf(code, pos, 2, "字段引用操作数");
      calls.push({ opcode: op, target: cp.memberRef(code.readUInt16BE(pos), 9) });
    } else if (op === 0xb6 || op === 0xb7 || op === 0xb8) {
      needBuf(code, pos, 2, "方法引用操作数");
      calls.push({ opcode: op, target: cp.memberRef(code.readUInt16BE(pos), 10) });
    } else if (op === 0xb9) {
      needBuf(code, pos, 2, "invokeinterface 操作数");
      calls.push({ opcode: op, target: cp.memberRef(code.readUInt16BE(pos), 11) });
    } else if (op === 0xba) {
      // invokedynamic：操作数索引的是 CONSTANT_InvokeDynamic（tag 18），
      // 其结构为 {bootstrapMethodAttrIndex, nameAndTypeIndex}——先取 tag-18 条目再读 NameAndType
      needBuf(code, pos, 2, "invokedynamic 操作数");
      const indyIdx = code.readUInt16BE(pos);
      const indy = cp.at(indyIdx);
      if (!indy || indy.tag !== 18 || indy.idx1 === undefined || indy.idx2 === undefined) {
        throw new ClassFormatError(`invokedynamic 常量池 #${indyIdx} 非 InvokeDynamic（tag 18）`);
      }
      const nt = cp.nameType(indy.idx2);
      calls.push({ opcode: op, target: { owner: "", name: nt.name, desc: nt.desc } });
    }

    if (op === 0xaa) {
      pos = align4(pos);
      if (pos + 12 > len) throw new ClassFormatError("tableswitch 越界");
      const low = code.readInt32BE(pos + 4);
      const high = code.readInt32BE(pos + 8);
      if (high < low) throw new ClassFormatError("tableswitch high<low");
      const n = high - low + 1;
      if (n < 0 || pos + 12 + n * 4 > len) throw new ClassFormatError("tableswitch 越界");
      pos += 12 + n * 4;
    } else if (op === 0xab) {
      pos = align4(pos);
      if (pos + 8 > len) throw new ClassFormatError("lookupswitch 越界");
      const npairs = code.readInt32BE(pos + 4);
      if (npairs < 0 || pos + 8 + npairs * 8 > len) throw new ClassFormatError("lookupswitch npairs 非法");
      pos += 8 + npairs * 8;
    } else if (op === 0xc4) {
      // wide：紧跟一个操作码；iinc 5 字节，其余 3 字节
      if (pos >= len) throw new ClassFormatError("wide 越界");
      const sub = code[pos];
      pos += sub === 0x84 ? 5 : 3;
    } else {
      pos += OP_SIZES[op];
    }
    if (!(pos > start) || pos > len) throw new ClassFormatError("指令未前进或越界");
  }
  return { opcodes, calls };
}

// ── 属性遍历（跳过未知属性；识别 Code / Record）────────────────────────────────

/** 读取 attributes_count 后的属性序列；对每个属性回调 (name, bodyStart, bodyLen, buf)。 */
function forEachAttribute(buf: Buffer, pos: number, cp: Cp, cb: (name: string, start: number, len: number) => void): number {
  needBuf(buf, pos, 2, "attributes_count");
  const count = buf.readUInt16BE(pos);
  let p = pos + 2;
  for (let i = 0; i < count; i++) {
    needBuf(buf, p, 6, `属性 #${i} 头部`);
    const name = cp.utf8(buf.readUInt16BE(p));
    const len = buf.readUInt32BE(p + 2);
    cb(name, p + 6, len);
    p += 6 + len;
  }
  return p;
}

// ── 类解析入口 ─────────────────────────────────────────────────────────────────

export function parseClassFile(buf: Buffer): ClassInfo {
  if (buf.length < 10 || buf.readUInt32BE(0) !== 0xcafebabe) {
    throw new ClassFormatError("魔数错误（非 class 文件）");
  }
  const cpCount = buf.readUInt16BE(8);
  const cp = new Cp(buf, 10, cpCount);
  let pos = cp.end;
  needBuf(buf, pos, 8, "access_flags/this/super/interfaces_count");
  const accessFlags = buf.readUInt16BE(pos);
  const thisClass = cp.className(buf.readUInt16BE(pos + 2));
  const superIdx = buf.readUInt16BE(pos + 4);
  const superName = superIdx === 0 ? undefined : cp.className(superIdx);
  pos += 6;

  const interfaces: string[] = [];
  const ifaceCount = buf.readUInt16BE(pos);
  pos += 2;
  for (let i = 0; i < ifaceCount; i++) {
    needBuf(buf, pos, 2, `interface #${i}`);
    interfaces.push(cp.className(buf.readUInt16BE(pos)));
    pos += 2;
  }

  const fields: ClassField[] = [];
  const fieldCount = buf.readUInt16BE(pos);
  pos += 2;
  for (let i = 0; i < fieldCount; i++) {
    needBuf(buf, pos, 6, `field #${i}`);
    const fAccess = buf.readUInt16BE(pos);
    const fName = cp.utf8(buf.readUInt16BE(pos + 2));
    const fDesc = cp.utf8(buf.readUInt16BE(pos + 4));
    fields.push({ name: fName, descriptor: fDesc, accessFlags: fAccess });
    pos = forEachAttribute(buf, pos + 6, cp, () => {});
  }

  const methods: ClassMethod[] = [];
  const methodCodes = new Map<string, number[]>();
  const calls = new Map<string, CallSite[]>();
  const methodCount = buf.readUInt16BE(pos);
  pos += 2;
  for (let i = 0; i < methodCount; i++) {
    needBuf(buf, pos, 8, `method #${i}`);
    const mAccess = buf.readUInt16BE(pos);
    const mName = cp.utf8(buf.readUInt16BE(pos + 2));
    const mDesc = cp.utf8(buf.readUInt16BE(pos + 4));
    methods.push({ name: mName, descriptor: mDesc, accessFlags: mAccess });
    const key = `${mName}${mDesc}`;
    const attrStart = pos + 6;
    let attrPos = attrStart;
    needBuf(buf, attrPos, 2, `method #${i} attributes_count`);
    const attrCount = buf.readUInt16BE(attrPos);
    attrPos += 2;
    for (let a = 0; a < attrCount; a++) {
      needBuf(buf, attrPos, 6, `method #${i} 属性 #${a} 头部`);
      const attrName = cp.utf8(buf.readUInt16BE(attrPos));
      const attrLen = buf.readUInt32BE(attrPos + 2);
      const body = attrPos + 6;
      if (attrName === "Code" && attrLen >= 8) {
        const codeLen = buf.readUInt32BE(body + 4);
        const codeStart = body + 8;
        if (codeStart + codeLen > buf.length) throw new ClassFormatError(`${key} Code 属性越界`);
        const { opcodes, calls: methodCalls } = disassemble(buf.subarray(codeStart, codeStart + codeLen), cp);
        methodCodes.set(key, opcodes);
        calls.set(key, methodCalls);
      }
      attrPos = body + attrLen;
    }
    pos = attrPos;
  }

  const recordComponents: RecordComponent[] = [];
  let classAttrPos = pos;
  needBuf(buf, classAttrPos, 2, "class attributes_count");
  const classAttrCount = buf.readUInt16BE(classAttrPos);
  classAttrPos += 2;
  for (let a = 0; a < classAttrCount; a++) {
    needBuf(buf, classAttrPos, 6, `class 属性 #${a} 头部`);
    const attrName = cp.utf8(buf.readUInt16BE(classAttrPos));
    const attrLen = buf.readUInt32BE(classAttrPos + 2);
    const body = classAttrPos + 6;
    if (attrName === "Record" && attrLen >= 2) {
      needBuf(buf, body, 2, "record 组件数");
      const compCount = buf.readUInt16BE(body);
      let p = body + 2;
      for (let c = 0; c < compCount; c++) {
        needBuf(buf, p, 6, `record 组件 #${c}`);
        const cName = cp.utf8(buf.readUInt16BE(p));
        const cDesc = cp.utf8(buf.readUInt16BE(p + 2));
        recordComponents.push({ name: cName, descriptor: cDesc });
        // 跳过组件内属性
        const innerCount = buf.readUInt16BE(p + 4);
        let q = p + 6;
        for (let ic = 0; ic < innerCount; ic++) {
          needBuf(buf, q, 6, `record 组件 #${c} 内层属性 #${ic}`);
          const il = buf.readUInt32BE(q + 2);
          q += 6 + il;
        }
        p = q;
      }
    }
    classAttrPos = body + attrLen;
  }

  return {
    className: thisClass,
    accessFlags,
    superName,
    interfaces,
    methods,
    fields,
    recordComponents,
    methodCodes,
    calls,
  };
}

// ── jar 访问（复用 T2 zip-util；带进程内缓存）──────────────────────────────────

const JAR_CACHE = new Map<string, Map<string, Buffer>>();
const JAR_CACHE_MAX = 4;

function jarCacheKey(jarPath: string): string {
  const st = statSync(jarPath);
  return `${jarPath}\0${st.mtimeMs}\0${st.size}`;
}

function loadJarMap(jarPath: string): Map<string, Buffer> {
  const key = jarCacheKey(jarPath);
  const hit = JAR_CACHE.get(key);
  if (hit) return hit;
  for (const k of [...JAR_CACHE.keys()]) {
    if (k === jarPath || k.startsWith(`${jarPath}\0`)) JAR_CACHE.delete(k);
  }
  const data = readZip(readFileSync(jarPath));
  // A-1 放大器防护：单 jar 解压总量超上限不进缓存（读本身已被 zip-inflate 逐条目限制）
  let total = 0;
  for (const buf of data.values()) total += buf.length;
  if (total <= 256 * 1024 * 1024) {
    if (JAR_CACHE.size >= JAR_CACHE_MAX) {
      JAR_CACHE.delete(JAR_CACHE.keys().next().value as string);
    }
    JAR_CACHE.set(key, data);
  }
  return data;
}

/** 从 jar 读取指定内部类名的原始 class 字节（无此类返回 null）。 */
export function loadClassFileFromJar(jarPath: string, classNameInternal: string): Buffer | null {
  const map = loadJarMap(jarPath);
  const entry = map.get(`${classNameInternal}.class`);
  return entry ? Buffer.from(entry) : null;
}

/** jar 内全部 .class 条目的内部类名（不含 .class 后缀）。 */
export function collectJarClasses(jarPath: string): string[] {
  const map = loadJarMap(jarPath);
  const out: string[] = [];
  for (const name of map.keys()) {
    if (name.endsWith(".class") && !name.startsWith("META-INF/")) {
      out.push(name.slice(0, -6));
    }
  }
  return out;
}

/** 解析后的类缓存（按 jar+类名，避免重复解析）。 */
export interface JarIndex {
  jarPath: string;
  hasClass(internalName: string): boolean;
  getClass(internalName: string): ClassInfo | null;
  listClasses(): string[];
}

export function buildJarIndex(jarPath: string): JarIndex {
  const classBytes = new Map<string, Buffer>();
  const parsed = new Map<string, ClassInfo>();
  const map = loadJarMap(jarPath);
  for (const [name, data] of map) {
    if (name.endsWith(".class") && !name.startsWith("META-INF/")) {
      classBytes.set(name.slice(0, -6), data);
    }
  }
  return {
    jarPath,
    hasClass(internalName: string): boolean {
      return classBytes.has(internalName);
    },
    getClass(internalName: string): ClassInfo | null {
      if (!classBytes.has(internalName)) return null;
      const hit = parsed.get(internalName);
      if (hit) return hit;
      const info = parseClassFile(classBytes.get(internalName)!);
      parsed.set(internalName, info);
      return info;
    },
    listClasses(): string[] {
      return [...classBytes.keys()];
    },
  };
}
