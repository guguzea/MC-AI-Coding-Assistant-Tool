---
title: "org.bukkit.block.Skull"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/block/Skull.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `boolean hasOwner()`
- `@Deprecated(since="1.9.4") @Nullable @Nullable String getOwner()`
- `@Deprecated(since="1.9.4") @Contract("null -> false") boolean setOwner(@Nullable @Nullable String name)`
- `@Nullable @Nullable OfflinePlayer getOwningPlayer()`
- `void setOwningPlayer(@NotNull @NotNull OfflinePlayer player)`
- `void setPlayerProfile(@NotNull PlayerProfile profile)`
- `@Nullable PlayerProfile getPlayerProfile()`
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
