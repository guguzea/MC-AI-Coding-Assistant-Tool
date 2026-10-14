---
title: "org.bukkit.block.DecoratedPot"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/DecoratedPot.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface DecoratedPot**
`public interface DecoratedPot extends TileState, BlockInventoryHolder`
- `void setSherd(@NotNull DecoratedPot.Side side, @Nullable Material sherd)`
- `@NotNull Material getSherd(@NotNull DecoratedPot.Side side)`
- `@NotNull Map<DecoratedPot.Side, Material> getSherds()`
- `@Deprecated(since="1.20.1") @NotNull List<Material> getShards()`
- `@NotNull DecoratedPotInventory getInventory()`
- `@NotNull DecoratedPotInventory getSnapshotInventory()`
