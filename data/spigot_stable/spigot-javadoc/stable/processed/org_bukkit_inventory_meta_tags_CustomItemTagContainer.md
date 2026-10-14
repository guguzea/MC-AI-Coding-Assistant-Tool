---
title: "org.bukkit.inventory.meta.tags.CustomItemTagContainer"
package: "org.bukkit.inventory.meta.tags"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/tags/CustomItemTagContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface CustomItemTagContainer**
`@Deprecated(since="1.14") public interface CustomItemTagContainer`
- `<T,Z> void setCustomTag(@NotNull NamespacedKey key, @NotNull ItemTagType<T,Z> type, @NotNull Z value)`
- `<T,Z> boolean hasCustomTag(@NotNull NamespacedKey key, @NotNull ItemTagType<T,Z> type)`
- `@Nullable <T,Z> Z getCustomTag(@NotNull NamespacedKey key, @NotNull ItemTagType<T,Z> type)`
- `void removeCustomTag(@NotNull NamespacedKey key)`
- `boolean isEmpty()`
- `@NotNull ItemTagAdapterContext getAdapterContext()`
