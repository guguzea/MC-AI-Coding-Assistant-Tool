---
title: "org.bukkit.inventory.meta.SkullMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/SkullMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface SkullMeta**
`public interface SkullMeta extends ItemMeta`
- `@Deprecated(since="1.12.1") @Nullable String getOwner()`
- `boolean hasOwner()`
- `@Deprecated(since="1.12.1") boolean setOwner(@Nullable String owner)`
- `@Nullable OfflinePlayer getOwningPlayer()`
- `boolean setOwningPlayer(@Nullable OfflinePlayer owner)`
- `@Nullable PlayerProfile getOwnerProfile()`
- `void setOwnerProfile(@Nullable PlayerProfile profile)`
- `void setNoteBlockSound(@Nullable NamespacedKey noteBlockSound)`
- `@Nullable NamespacedKey getNoteBlockSound()`
- `@NotNull SkullMeta clone()`
