---
title: "org.bukkit.block.Conduit"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.block.Conduit extends org.bukkit.block.TileState`
- `public abstract boolean isActive()`
- `public abstract boolean isHunting()`
- `public abstract java.util.Collection<org.bukkit.block.Block> getFrameBlocks()`
- `public abstract int getFrameBlockCount()`
- `public abstract int getRange()`
- `public abstract boolean setTarget(org.bukkit.entity.LivingEntity)`
- `public abstract org.bukkit.entity.LivingEntity getTarget()`
- `public abstract boolean hasTarget()`
- `public abstract org.bukkit.util.BoundingBox getHuntingArea()`
