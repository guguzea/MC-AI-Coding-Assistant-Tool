---
title: "org.bukkit.structure.Structure"
package: "org.bukkit.structure"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.structure.Structure extends org.bukkit.persistence.PersistentDataHolder`
- `public abstract org.bukkit.util.BlockVector getSize()`
- `public abstract java.util.List<org.bukkit.structure.Palette> getPalettes()`
- `public abstract int getPaletteCount()`
- `public abstract java.util.List<org.bukkit.entity.Entity> getEntities()`
- `public abstract int getEntityCount()`
- `public abstract void place(org.bukkit.Location, boolean, org.bukkit.block.structure.StructureRotation, org.bukkit.block.structure.Mirror, int, float, java.util.Random)`
- `public abstract void place(org.bukkit.RegionAccessor, org.bukkit.util.BlockVector, boolean, org.bukkit.block.structure.StructureRotation, org.bukkit.block.structure.Mirror, int, float, java.util.Random)`
- `public abstract void fill(org.bukkit.Location, org.bukkit.Location, boolean)`
- `public abstract void fill(org.bukkit.Location, org.bukkit.util.BlockVector, boolean)`
