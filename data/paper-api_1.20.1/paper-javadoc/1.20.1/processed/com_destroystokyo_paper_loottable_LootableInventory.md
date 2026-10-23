---
title: "com.destroystokyo.paper.loottable.LootableInventory"
package: "com.destroystokyo.paper.loottable"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/loottable/LootableInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `boolean isRefillEnabled()`
- `boolean hasBeenFilled()`
- `default boolean hasPlayerLooted(@NotNull @NotNull Player player)`
- `boolean canPlayerLoot(@NotNull @NotNull UUID player)`
- `boolean hasPlayerLooted(@NotNull @NotNull UUID player)`
- `@Nullable default @Nullable Long getLastLooted(@NotNull @NotNull Player player)`
- `@Nullable @Nullable Long getLastLooted(@NotNull @NotNull UUID player)`
- `default boolean setHasPlayerLooted(@NotNull @NotNull Player player, boolean looted)`
- `boolean setHasPlayerLooted(@NotNull @NotNull UUID player, boolean looted)`
- `boolean hasPendingRefill()`
- `long getLastFilled()`
- `long getNextRefill()`
- `long setNextRefill(long refillAt)`
