---
title: "org.bukkit.block.Skull"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Skull.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Skull**
`public interface Skull extends TileState`
- `boolean hasOwner()`
- `@Deprecated(since="1.9.4") @Nullable String getOwner()`
- `@Deprecated(since="1.9.4") @Contract("null -> false") boolean setOwner(@Nullable String name)`
- `@Nullable OfflinePlayer getOwningPlayer()`
- `void setOwningPlayer(@NotNull OfflinePlayer player)`
- `@Nullable PlayerProfile getOwnerProfile()`
- `void setOwnerProfile(@Nullable PlayerProfile profile)`
- `@Nullable NamespacedKey getNoteBlockSound()`
- `void setNoteBlockSound(@Nullable NamespacedKey noteBlockSound)`
- `@Deprecated(since="1.13") @NotNull BlockFace getRotation()`
- `@Deprecated(since="1.13") void setRotation(@NotNull BlockFace rotation)`
- `@Deprecated(since="1.13") @NotNull SkullType getSkullType()`
- `@Deprecated(since="1.13") @Contract("_ -> fail") void setSkullType(SkullType skullType)`
