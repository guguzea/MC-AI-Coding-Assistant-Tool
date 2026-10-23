---
title: "org.bukkit.block.DecoratedPot"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.block.DecoratedPot extends org.bukkit.block.TileState,org.bukkit.inventory.BlockInventoryHolder`
- `public abstract void setSherd(org.bukkit.block.DecoratedPot$Side, org.bukkit.Material)`
- `public abstract org.bukkit.Material getSherd(org.bukkit.block.DecoratedPot$Side)`
- `public abstract java.util.Map<org.bukkit.block.DecoratedPot$Side, org.bukkit.Material> getSherds()`
- `public abstract java.util.List<org.bukkit.Material> getShards()`
- `public abstract org.bukkit.inventory.DecoratedPotInventory getInventory()`
- `public abstract org.bukkit.inventory.DecoratedPotInventory getSnapshotInventory()`
- `public default org.bukkit.inventory.Inventory getInventory()`
