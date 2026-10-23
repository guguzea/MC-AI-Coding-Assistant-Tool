---
title: "org.bukkit.packs.DataPackManager"
package: "org.bukkit.packs"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
