---
title: "org.bukkit.entity.PigZombie"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/PigZombie.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PigZombie**
`public interface PigZombie extends Zombie`
- `int getAnger()`
- `void setAnger(int level)`
- `void setAngry(boolean angry)`
- `boolean isAngry()`
- `@Contract("-> false") boolean isConverting()`
- `@Contract("-> fail") int getConversionTime()`
- `@Contract("_ -> fail") void setConversionTime(int time)`
