---
title: "org.bukkit.block.Skull"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/block/Skull.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `boolean hasOwner()`
- `@Deprecated @Nullable @Nullable String getOwner()`
- `@Deprecated @Contract("null -> false") boolean setOwner(@Nullable @Nullable String name)`
- `@Nullable @Nullable OfflinePlayer getOwningPlayer()`
- `void setOwningPlayer(@NotNull @NotNull OfflinePlayer player)`
- `void setPlayerProfile(@NotNull PlayerProfile profile)`
- `@Nullable PlayerProfile getPlayerProfile()`
- `@Nullable @Deprecated @Nullable PlayerProfile getOwnerProfile()`
- `@Deprecated void setOwnerProfile(@Nullable @Nullable PlayerProfile profile)`
- `@Nullable @Nullable NamespacedKey getNoteBlockSound()`
- `void setNoteBlockSound(@Nullable @Nullable NamespacedKey noteBlockSound)`
- `@Deprecated @NotNull @NotNull BlockFace getRotation()`
- `@Deprecated void setRotation(@NotNull @NotNull BlockFace rotation)`
- `@Deprecated @NotNull @NotNull SkullType getSkullType()`
- `@Deprecated @Contract("_ -> fail") void setSkullType(SkullType skullType)`
