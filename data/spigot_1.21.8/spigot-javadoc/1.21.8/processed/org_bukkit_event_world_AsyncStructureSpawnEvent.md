---
title: "org.bukkit.event.world.AsyncStructureSpawnEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.world.AsyncStructureSpawnEvent extends org.bukkit.event.world.WorldEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.world.AsyncStructureSpawnEvent(org.bukkit.World, org.bukkit.generator.structure.Structure, org.bukkit.util.BoundingBox, int, int)`
- `public org.bukkit.generator.structure.Structure getStructure()`
- `public org.bukkit.util.BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
