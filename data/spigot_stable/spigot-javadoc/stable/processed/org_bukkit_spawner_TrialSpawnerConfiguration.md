---
title: "org.bukkit.spawner.TrialSpawnerConfiguration"
package: "org.bukkit.spawner"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/spawner/TrialSpawnerConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface TrialSpawnerConfiguration**
`public interface TrialSpawnerConfiguration extends BaseSpawner`
- `float getBaseSpawnsBeforeCooldown()`
- `void setBaseSpawnsBeforeCooldown(float amount)`
- `float getBaseSimultaneousEntities()`
- `void setBaseSimultaneousEntities(float amount)`
- `float getAdditionalSpawnsBeforeCooldown()`
- `void setAdditionalSpawnsBeforeCooldown(float amount)`
- `float getAdditionalSimultaneousEntities()`
- `void setAdditionalSimultaneousEntities(float amount)`
- `@NotNull Map<LootTable, Integer> getPossibleRewards()`
- `void addPossibleReward(@NotNull LootTable table, int weight)`
- `void removePossibleReward(@NotNull LootTable table)`
- `void setPossibleRewards(@NotNull Map<LootTable, Integer> rewards)`
