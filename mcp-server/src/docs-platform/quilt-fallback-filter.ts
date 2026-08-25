/**
 * Quilt → Fabric 文档回退过滤。
 * QSL 专用查询禁止 semanticSearch(fabric)；通用回退丢掉 FAPI 专属 Registry 页。
 */

export function isQslSpecificQuery(query: string): boolean {
  return /quiltregistry|org\.quiltmc|\bqsl\b|\bqfapi\b|registryentryattachment|quilted\s*fabric|quilt\.mod\.json|quilt_loader/i.test(
    query,
  );
}

const FABRIC_EXCLUSIVE_CLASS = [
  /net\.fabricmc\.fabric\.api\.event\.registry/,
  /net\.fabricmc\.fabric\.api\.registry/,
  /FabricRegistryBuilder/,
  /RegistrySyncManager/,
  /FabricItemGroup/,
  /FabricItemSettings/,
  /ItemGroupEvents/,
  /net\.fabricmc\.fabric\.api\.itemgroup/,
  /net\.fabricmc\.fabric\.api\.item\b/,
  /net\.fabricmc\.fabric\.api\.object\.builder/,
  /net\.fabricmc\.fabric\.api\.event\.lifecycle/,
  /ServerPlayNetworking/,
  /ClientPlayNetworking/,
  /PacketByteBufs/,
  /net\.fabricmc\.fabric\.api\.networking/,
];

export function isFabricExclusiveHit(hit: {
  id?: string;
  label?: string;
  url?: string;
  tags?: string[];
}): boolean {
  const blob = [hit.id, hit.label, hit.url, ...(hit.tags ?? [])].join(" ");
  if (FABRIC_EXCLUSIVE_CLASS.some((re) => re.test(blob))) return true;
  if (/fabric-api/i.test(blob) && /registr/i.test(blob)) return true;
  return false;
}

/**
 * 正文探测（F-D105）：元数据干净的 FAPI 专属页（正文通篇教 FabricRegistryBuilder /
 * net.fabricmc.fabric.api.event.registry 用法）同样不得以 fallback=fabric 放行给 Quilt。
 */
export function isFabricExclusiveContent(content: string | undefined | null): boolean {
  if (!content) return false;
  return FABRIC_EXCLUSIVE_CLASS.some((re) => re.test(content));
}

export function isSharedOrVanillaHit(hit: {
  id?: string;
  label?: string;
  url?: string;
  tags?: string[];
}): boolean {
  const blob = [hit.id, hit.label, hit.url, ...(hit.tags ?? [])].join(" ");
  if (/net\.minecraft\./.test(blob)) return true;
  if (/\b(loom|yarn|mixin|datapack|resource.?pack)\b/i.test(blob)) return true;
  return !isFabricExclusiveHit(hit);
}

export function filterFabricFallbackHits<T extends { id?: string; label?: string; url?: string; tags?: string[] }>(
  hits: T[],
): { hits: T[]; dropped: number } {
  const kept = hits.filter((h) => isSharedOrVanillaHit(h) && !isFabricExclusiveHit(h));
  return { hits: kept, dropped: hits.length - kept.length };
}
