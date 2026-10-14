---
title: "org.bukkit.entity.Zombie"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Zombie.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Zombie**
`public interface Zombie extends Monster, Ageable`
- `@Deprecated(since="1.16.2") boolean isBaby()`
- `@Deprecated(since="1.16.2") void setBaby(boolean baby)`
- `@Deprecated(since="1.10.2", forRemoval=true) boolean isVillager()`
- `@Deprecated(since="1.9", forRemoval=true) @Contract("_ -> fail") void setVillager(boolean flag)`
- `@Deprecated(since="1.10.2", forRemoval=true) @Contract("_ -> fail") void setVillagerProfession(Villager.Profession profession)`
- `@Deprecated(since="1.10.2", forRemoval=true) @Nullable @Contract("-> null") Villager.Profession getVillagerProfession()`
- `boolean isConverting()`
- `int getConversionTime()`
- `void setConversionTime(int time)`
- `boolean canBreakDoors()`
- `void setCanBreakDoors(boolean flag)`
- `boolean isDrowning()`
- `@Deprecated void startDrowning(int time)`
- `void stopDrowning()`
- `@Deprecated void setArmsRaised(boolean raised)`
- `@Deprecated boolean isArmsRaised()`
- `boolean shouldBurnInDay()`
- `void setShouldBurnInDay(boolean shouldBurnInDay)`
- `@Deprecated(since="1.21.2", forRemoval=true) default boolean supportsBreakingDoors()`
