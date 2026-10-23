---
title: "org.bukkit.spawner.TrialSpawnerConfiguration"
package: "org.bukkit.spawner"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.spawner.TrialSpawnerConfiguration extends org.bukkit.spawner.BaseSpawner`
- `public abstract float getBaseSpawnsBeforeCooldown()`
- `public abstract void setBaseSpawnsBeforeCooldown(float)`
- `public abstract float getBaseSimultaneousEntities()`
- `public abstract void setBaseSimultaneousEntities(float)`
- `public abstract float getAdditionalSpawnsBeforeCooldown()`
- `public abstract void setAdditionalSpawnsBeforeCooldown(float)`
- `public abstract float getAdditionalSimultaneousEntities()`
- `public abstract void setAdditionalSimultaneousEntities(float)`
- `public abstract java.util.Map<org.bukkit.loot.LootTable, java.lang.Integer> getPossibleRewards()`
- `public abstract void addPossibleReward(org.bukkit.loot.LootTable, int)`
- `public abstract void removePossibleReward(org.bukkit.loot.LootTable)`
- `public abstract void setPossibleRewards(java.util.Map<org.bukkit.loot.LootTable, java.lang.Integer>)`
