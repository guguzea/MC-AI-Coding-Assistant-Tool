---
title: "org.bukkit.inventory.meta.tags.CustomItemTagContainer"
package: "org.bukkit.inventory.meta.tags"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/inventory/meta/tags/CustomItemTagContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `<T, Z> void setCustomTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemTagType<T,Z> type, @NotNull Z value)`
- `<T, Z> boolean hasCustomTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemTagType<T,Z> type)`
- `@Nullable <T, Z> Z getCustomTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemTagType<T,Z> type)`
- `void removeCustomTag(@NotNull @NotNull NamespacedKey key)`
- `boolean isEmpty()`
- `@NotNull @NotNull ItemTagAdapterContext getAdapterContext()`
