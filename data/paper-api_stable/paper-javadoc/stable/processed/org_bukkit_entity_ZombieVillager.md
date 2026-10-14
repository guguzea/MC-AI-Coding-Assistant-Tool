---
title: "org.bukkit.entity.ZombieVillager"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/ZombieVillager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ZombieVillager**
`public interface ZombieVillager extends Zombie`
- `void setVillagerProfession(@NotNull Villager.Profession profession)`
- `@NotNull Villager.Profession getVillagerProfession()`
- `@NotNull Villager.Type getVillagerType()`
- `void setVillagerType(@NotNull Villager.Type type)`
- `boolean isConverting()`
- `int getConversionTime()`
- `void setConversionTime(int time)`
- `@Nullable @Nullable OfflinePlayer getConversionPlayer()`
- `void setConversionPlayer(@Nullable @Nullable OfflinePlayer conversionPlayer)`
- `void setConversionTime(int time, boolean broadcastEntityEvent)`
