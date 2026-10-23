---
title: "org.bukkit.block.Conduit"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
