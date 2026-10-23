---
title: "org.bukkit.structure.Structure"
package: "org.bukkit.structure"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
