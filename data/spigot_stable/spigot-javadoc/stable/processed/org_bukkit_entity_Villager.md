---
title: "org.bukkit.entity.Villager"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Villager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Villager**
`public interface Villager extends AbstractVillager`
- `@NotNull Villager.Profession getProfession()`
- `void setProfession(@NotNull Villager.Profession profession)`
- `@NotNull Villager.Type getVillagerType()`
- `void setVillagerType(@NotNull Villager.Type type)`
- `int getVillagerLevel()`
- `void setVillagerLevel(int level)`
- `int getVillagerExperience()`
- `void setVillagerExperience(int experience)`
- `boolean sleep(@NotNull Location location)`
- `void wakeup()`
- `void shakeHead()`
- `@Nullable ZombieVillager zombify()`
- `int getReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType)`
- `int getWeightedReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType)`
- `int getReputation(@NotNull UUID uuid)`
- `void addReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType, int amount)`
- `void addReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType, int amount, @NotNull Villager.ReputationEvent changeReason)`
- `void removeReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType, int amount)`
- `void removeReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType, int amount, @NotNull Villager.ReputationEvent changeReason)`
- `void setReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType, int amount)`
- `void setReputation(@NotNull UUID uuid, @NotNull Villager.ReputationType reputationType, int amount, @NotNull Villager.ReputationEvent changeReason)`
- `void setGossipDecayTime(long ticks)`
- `long getGossipDecayTime()`
