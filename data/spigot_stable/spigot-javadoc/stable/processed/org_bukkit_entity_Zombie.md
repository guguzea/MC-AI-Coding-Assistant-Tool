---
title: "org.bukkit.entity.Zombie"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Zombie.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Zombie**
`public interface Zombie extends Monster, Ageable`
- `@Deprecated(since="1.16.2") boolean isBaby()`
- `@Deprecated(since="1.16.2") void setBaby(boolean flag)`
- `@Deprecated(since="1.10.2") boolean isVillager()`
- `@Deprecated(since="1.9") @Contract("_ -> fail") void setVillager(boolean flag)`
- `@Deprecated(since="1.10.2") @Contract("_ -> fail") void setVillagerProfession(Villager.Profession profession)`
- `@Deprecated(since="1.10.2") @Nullable @Contract("-> null") Villager.Profession getVillagerProfession()`
- `boolean isConverting()`
- `int getConversionTime()`
- `void setConversionTime(int time)`
- `boolean canBreakDoors()`
- `void setCanBreakDoors(boolean flag)`
