---
title: "com.destroystokyo.paper.loottable.LootableInventory"
package: "com.destroystokyo.paper.loottable"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/loottable/LootableInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface LootableInventory**
`@NullMarked public interface LootableInventory extends Lootable`
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
