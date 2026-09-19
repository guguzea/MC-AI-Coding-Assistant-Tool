/**
 * W4-3：Gradle 占位符识别。
 *
 * 官方 MDK / 本仓各档 scaffold 的元数据（mods.toml / neoforge.mods.toml / fabric.mod.json）
 * 大量使用 `${mod_id}`、`${version}` 这类 Gradle 占位符，构建期由 processResources 用
 * gradle.properties 的同名属性展开。静态校验不得把它们当「非法 modId」判红；
 * 能从 gradle.properties 解析出属性值时按解析值走原校验（检查反而更强），
 * 解析不到时降级为 warning 说明。
 */

import { parseGradleProperties } from "../gradle/index.js";

/** 提取 `${prop}` 的属性名；非占位符（或形似但为空）返回 null。 */
export function gradlePlaceholderProp(value: string): string | null {
  const m = value.match(/^\$\{([^}]+)\}$/);
  return m ? m[1] : null;
}

export interface PlaceholderResolution {
  /** 解析后的值；解析不到时为原字符串 */
  value: string;
  /** true = 非占位符，或占位符已在 gradle.properties 中找到同名属性 */
  resolved: boolean;
}

/** `${prop}` → gradle.properties 属性值；非占位符原样返回（resolved=true）；解析不到 resolved=false。 */
export function resolveGradlePlaceholder(value: string, gradleProperties?: string): PlaceholderResolution {
  const prop = gradlePlaceholderProp(value);
  if (!prop) return { value, resolved: true };
  const v = gradleProperties ? parseGradleProperties(gradleProperties)[prop] : undefined;
  return v ? { value: v, resolved: true } : { value, resolved: false };
}
