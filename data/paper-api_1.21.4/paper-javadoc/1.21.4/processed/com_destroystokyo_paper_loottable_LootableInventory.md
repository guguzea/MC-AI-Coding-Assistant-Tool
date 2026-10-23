---
title: "com.destroystokyo.paper.loottable.LootableInventory"
package: "com.destroystokyo.paper.loottable"
source: https://jd.papermc.io/paper/1.21.4/com/destroystokyo/paper/loottable/LootableInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `boolean isRefillEnabled()`
- `boolean hasBeenFilled()`
- `default boolean hasPlayerLooted(Player player)`
- `boolean canPlayerLoot(UUID player)`
- `boolean hasPlayerLooted(UUID player)`
- `default @Nullable Long getLastLooted(Player player)`
- `@Nullable Long getLastLooted(UUID player)`
- `default boolean setHasPlayerLooted(Player player, boolean looted)`
- `boolean setHasPlayerLooted(UUID player, boolean looted)`
- `boolean hasPendingRefill()`
- `long getLastFilled()`
- `long getNextRefill()`
- `long setNextRefill(long refillAt)`
