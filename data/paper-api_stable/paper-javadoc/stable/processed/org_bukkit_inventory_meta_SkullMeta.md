---
title: "org.bukkit.inventory.meta.SkullMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/SkullMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SkullMeta**
`public interface SkullMeta extends ItemMeta`
- `@Deprecated(since="1.12.1") @Nullable @Nullable String getOwner()`
- `boolean hasOwner()`
- `@Deprecated(since="1.12.1") boolean setOwner(@Nullable @Nullable String owner)`
- `void setPlayerProfile(@Nullable PlayerProfile profile)`
- `@Nullable PlayerProfile getPlayerProfile()`
- `@Nullable @Nullable OfflinePlayer getOwningPlayer()`
- `boolean setOwningPlayer(@Nullable @Nullable OfflinePlayer owner)`
- `@Nullable @Deprecated @Nullable PlayerProfile getOwnerProfile()`
- `@Deprecated void setOwnerProfile(@Nullable @Nullable PlayerProfile profile)`
- `void setNoteBlockSound(@Nullable @Nullable NamespacedKey noteBlockSound)`
- `@Nullable @Nullable NamespacedKey getNoteBlockSound()`
- `@NotNull @NotNull SkullMeta clone()`
