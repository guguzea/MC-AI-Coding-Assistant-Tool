---
title: "org.bukkit.event.world.AsyncStructureGenerateEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.world.AsyncStructureGenerateEvent extends org.bukkit.event.world.WorldEvent`
- `public org.bukkit.event.world.AsyncStructureGenerateEvent(org.bukkit.World, boolean, org.bukkit.event.world.AsyncStructureGenerateEvent$Cause, org.bukkit.generator.structure.Structure, org.bukkit.util.BoundingBox, int, int)`
- `public org.bukkit.event.world.AsyncStructureGenerateEvent$Cause getCause()`
- `public org.bukkit.util.BlockTransformer getBlockTransformer(org.bukkit.NamespacedKey)`
- `public void setBlockTransformer(org.bukkit.NamespacedKey, org.bukkit.util.BlockTransformer)`
- `public void removeBlockTransformer(org.bukkit.NamespacedKey)`
- `public void clearBlockTransformers()`
- `public java.util.Map<org.bukkit.NamespacedKey, org.bukkit.util.BlockTransformer> getBlockTransformers()`
- `public org.bukkit.util.EntityTransformer getEntityTransformer(org.bukkit.NamespacedKey)`
- `public void setEntityTransformer(org.bukkit.NamespacedKey, org.bukkit.util.EntityTransformer)`
- `public void removeEntityTransformer(org.bukkit.NamespacedKey)`
- `public void clearEntityTransformers()`
- `public java.util.Map<org.bukkit.NamespacedKey, org.bukkit.util.EntityTransformer> getEntityTransformers()`
- `public org.bukkit.generator.structure.Structure getStructure()`
- `public org.bukkit.util.BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
