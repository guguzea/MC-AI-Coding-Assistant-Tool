---
title: "org.bukkit.entity.Villager"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Villager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Villager**
`public interface Villager extends AbstractVillager`
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
- `@NotNull @NotNull Map<UUID, Reputation> getReputations()`
- `void setReputation(@NotNull @NotNull UUID uniqueId, @NotNull Reputation reputation)`
- `void setReputations(@NotNull @NotNull Map<UUID, Reputation> reputations)`
- `void clearReputations()`
- `void updateDemand()`
- `void restock()`
