---
title: "com.destroystokyo.paper.loottable.LootableInventory"
package: "com.destroystokyo.paper.loottable"
source: https://jd.papermc.io/paper/1.12.2/com/destroystokyo/paper/loottable/LootableInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `long getLastFilled()`
- `Long getLastLooted(UUID player)`
- `default Long getLastLooted(Player player)`
- `long getNextRefill()`
- `boolean hasBeenFilled()`
- `boolean hasPendingRefill()`
- `boolean hasPlayerLooted(UUID player)`
- `default boolean hasPlayerLooted(Player player)`
- `boolean isRefillEnabled()`
- `boolean setHasPlayerLooted(UUID player, boolean looted)`
- `default boolean setHasPlayerLooted(Player player, boolean looted)`
- `long setNextRefill(long refillAt)`
