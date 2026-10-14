---
title: "org.bukkit.block.Skull"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Skull.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Skull**
`public interface Skull extends TileState`
- `@Nullable @Nullable ResolvableProfile getProfile()`
- `void setProfile(@Nullable @Nullable ResolvableProfile profile)`
- `@Deprecated(since="1.21.9") boolean hasOwner()`
- `@Deprecated(since="1.9.4") @Nullable @Nullable String getOwner()`
- `@Deprecated(since="1.9.4") @Contract("null -> false") boolean setOwner(@Nullable @Nullable String name)`
- `@Deprecated(since="1.21.9") @Nullable @Nullable OfflinePlayer getOwningPlayer()`
- `@Deprecated(since="1.21.9") void setOwningPlayer(@NotNull @NotNull OfflinePlayer player)`
- `@Deprecated(since="1.21.9") void setPlayerProfile(@NotNull PlayerProfile profile)`
- `@Deprecated(since="1.21.9") @Nullable PlayerProfile getPlayerProfile()`
- `@Nullable @Deprecated @Nullable PlayerProfile getOwnerProfile()`
- `@Deprecated void setOwnerProfile(@Nullable @Nullable PlayerProfile profile)`
- `@Nullable @Nullable NamespacedKey getNoteBlockSound()`
- `void setNoteBlockSound(@Nullable @Nullable NamespacedKey noteBlockSound)`
- `@Deprecated(since="1.13") @NotNull @NotNull BlockFace getRotation()`
- `@Deprecated(since="1.13") void setRotation(@NotNull @NotNull BlockFace rotation)`
- `@Deprecated(since="1.13", forRemoval=true) @NotNull @NotNull SkullType getSkullType()`
- `@Deprecated(since="1.13", forRemoval=true) @Contract("_ -> fail") void setSkullType(SkullType skullType)`
- `@Nullable @Nullable Component customName()`
- `void customName(@Nullable @Nullable Component customName)`
