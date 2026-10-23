---
title: "org.bukkit.packs.DataPackManager"
package: "org.bukkit.packs"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.packs.DataPackManager`
- `public abstract java.util.Collection<org.bukkit.packs.DataPack> getDataPacks()`
- `public abstract org.bukkit.packs.DataPack getDataPack(org.bukkit.NamespacedKey)`
- `public abstract java.util.Collection<org.bukkit.packs.DataPack> getEnabledDataPacks(org.bukkit.World)`
- `public abstract java.util.Collection<org.bukkit.packs.DataPack> getDisabledDataPacks(org.bukkit.World)`
- `public abstract boolean isEnabledByFeature(org.bukkit.Material, org.bukkit.World)`
- `public abstract boolean isEnabledByFeature(org.bukkit.entity.EntityType, org.bukkit.World)`
