---
title: "org.bukkit.packs.DataPackManager"
package: "org.bukkit.packs"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.packs.DataPackManager`
- `public abstract java.util.Collection<org.bukkit.packs.DataPack> getDataPacks()`
- `public abstract org.bukkit.packs.DataPack getDataPack(org.bukkit.NamespacedKey)`
- `public abstract java.util.Collection<org.bukkit.packs.DataPack> getEnabledDataPacks(org.bukkit.World)`
- `public abstract java.util.Collection<org.bukkit.packs.DataPack> getDisabledDataPacks(org.bukkit.World)`
- `public abstract boolean isEnabledByFeature(org.bukkit.Material, org.bukkit.World)`
- `public abstract boolean isEnabledByFeature(org.bukkit.inventory.ItemType, org.bukkit.World)`
- `public abstract boolean isEnabledByFeature(org.bukkit.block.BlockType, org.bukkit.World)`
- `public abstract boolean isEnabledByFeature(org.bukkit.entity.EntityType, org.bukkit.World)`
