---
title: "com.destroystokyo.paper.loottable.LootableInventory"
package: "com.destroystokyo.paper.loottable"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/loottable/LootableInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `boolean isRefillEnabled()`
- `boolean hasBeenFilled()`
- `default boolean hasPlayerLooted&#8203;(@NotNull @NotNull Player player)`
- `boolean hasPlayerLooted&#8203;(@NotNull @NotNull UUID player)`
- `@Nullable default @Nullable Long getLastLooted&#8203;(@NotNull @NotNull Player player)`
- `@Nullable @Nullable Long getLastLooted&#8203;(@NotNull @NotNull UUID player)`
- `default boolean setHasPlayerLooted&#8203;(@NotNull @NotNull Player player, boolean looted)`
- `boolean setHasPlayerLooted&#8203;(@NotNull @NotNull UUID player, boolean looted)`
- `boolean hasPendingRefill()`
- `long getLastFilled()`
- `long getNextRefill()`
- `long setNextRefill&#8203;(long refillAt)`
