---
title: "org.bukkit.entity.Villager"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.entity.Villager extends org.bukkit.entity.AbstractVillager`
- `public abstract org.bukkit.entity.Villager$Profession getProfession()`
- `public abstract void setProfession(org.bukkit.entity.Villager$Profession)`
- `public abstract org.bukkit.entity.Villager$Type getVillagerType()`
- `public abstract void setVillagerType(org.bukkit.entity.Villager$Type)`
- `public abstract int getVillagerLevel()`
- `public abstract void setVillagerLevel(int)`
- `public abstract int getVillagerExperience()`
- `public abstract void setVillagerExperience(int)`
- `public abstract boolean sleep(org.bukkit.Location)`
- `public abstract void wakeup()`
- `public abstract void shakeHead()`
- `public abstract org.bukkit.entity.ZombieVillager zombify()`
- `public abstract int getReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType)`
- `public abstract int getWeightedReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType)`
- `public abstract int getReputation(java.util.UUID)`
- `public abstract void addReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType, int)`
- `public abstract void addReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType, int, org.bukkit.entity.Villager$ReputationEvent)`
- `public abstract void removeReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType, int)`
- `public abstract void removeReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType, int, org.bukkit.entity.Villager$ReputationEvent)`
- `public abstract void setReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType, int)`
- `public abstract void setReputation(java.util.UUID, org.bukkit.entity.Villager$ReputationType, int, org.bukkit.entity.Villager$ReputationEvent)`
- `public abstract void setGossipDecayTime(long)`
- `public abstract long getGossipDecayTime()`
