---
title: "org.bukkit.block.DecoratedPot"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/DecoratedPot.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DecoratedPot**
`@NullMarked public interface DecoratedPot extends TileStateInventoryHolder, Lootable`
- `void setSherd(DecoratedPot.Side side, @Nullable Material sherd)`
- `Material getSherd(DecoratedPot.Side side)`
- `Map<DecoratedPot.Side, Material> getSherds()`
- `@Deprecated(since="1.20.1") List<Material> getShards()`
- `DecoratedPotInventory getInventory()`
- `DecoratedPotInventory getSnapshotInventory()`
- `void startWobble(DecoratedPot.WobbleStyle style)`
