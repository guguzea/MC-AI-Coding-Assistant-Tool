---
title: "org.bukkit.inventory.meta.tags.CustomItemTagContainer"
package: "org.bukkit.inventory.meta.tags"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/tags/CustomItemTagContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CustomItemTagContainer**
`@Deprecated(since="1.14", forRemoval=true) public interface CustomItemTagContainer`
- `<T,Z> void setCustomTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemTagType<T,Z> type, @NotNull Z value)`
- `<T,Z> boolean hasCustomTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemTagType<T,Z> type)`
- `@Nullable <T,Z> Z getCustomTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemTagType<T,Z> type)`
- `void removeCustomTag(@NotNull @NotNull NamespacedKey key)`
- `boolean isEmpty()`
- `@NotNull @NotNull ItemTagAdapterContext getAdapterContext()`
