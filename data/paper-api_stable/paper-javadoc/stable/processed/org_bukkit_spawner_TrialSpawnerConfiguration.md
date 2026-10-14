---
title: "org.bukkit.spawner.TrialSpawnerConfiguration"
package: "org.bukkit.spawner"
source: https://jd.papermc.io/paper/26.3/org/bukkit/spawner/TrialSpawnerConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TrialSpawnerConfiguration**
`@NullMarked @Experimental public interface TrialSpawnerConfiguration extends BaseSpawner`
- `float getBaseSpawnsBeforeCooldown()`
- `void setBaseSpawnsBeforeCooldown(float amount)`
- `float getBaseSimultaneousEntities()`
- `void setBaseSimultaneousEntities(float amount)`
- `float getAdditionalSpawnsBeforeCooldown()`
- `void setAdditionalSpawnsBeforeCooldown(float amount)`
- `float getAdditionalSimultaneousEntities()`
- `void setAdditionalSimultaneousEntities(float amount)`
- `Map<LootTable, Integer> getPossibleRewards()`
- `void addPossibleReward(LootTable table, int weight)`
- `void removePossibleReward(LootTable table)`
- `void setPossibleRewards(Map<LootTable, Integer> rewards)`
