---
title: "org.bukkit.entity.Villager"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/entity/Villager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Villager.Profession getProfession()`
- `void setProfession(@NotNull @NotNull Villager.Profession profession)`
- `@NotNull @NotNull Villager.Type getVillagerType()`
- `void setVillagerType(@NotNull @NotNull Villager.Type type)`
- `int getVillagerLevel()`
- `void setVillagerLevel(int level)`
- `int getVillagerExperience()`
- `void setVillagerExperience(int experience)`
- `boolean increaseLevel(int amount)`
- `boolean addTrades(int amount)`
- `int getRestocksToday()`
- `void setRestocksToday(int restocksToday)`
- `boolean sleep(@NotNull @NotNull Location location)`
- `void wakeup()`
- `void shakeHead()`
- `@Nullable @Nullable ZombieVillager zombify()`
- `@NotNull Reputation getReputation(@NotNull @NotNull UUID uniqueId)`
- `@NotNull @NotNull Map<UUID,Reputation> getReputations()`
- `void setReputation(@NotNull @NotNull UUID uniqueId, @NotNull Reputation reputation)`
- `void setReputations(@NotNull @NotNull Map<UUID,Reputation> reputations)`
- `void clearReputations()`
