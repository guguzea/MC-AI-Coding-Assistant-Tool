---
title: "org.bukkit.entity.Panda"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Panda.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Panda**
`public interface Panda extends Animals, Sittable`
- `@NotNull @NotNull Panda.Gene getMainGene()`
- `void setMainGene(@NotNull @NotNull Panda.Gene gene)`
- `@NotNull @NotNull Panda.Gene getHiddenGene()`
- `void setHiddenGene(@NotNull @NotNull Panda.Gene gene)`
- `boolean isRolling()`
- `void setRolling(boolean flag)`
- `boolean isSneezing()`
- `void setSneezing(boolean flag)`
- `boolean isOnBack()`
- `void setOnBack(boolean flag)`
- `boolean isEating()`
- `void setEating(boolean flag)`
- `boolean isScared()`
- `int getUnhappyTicks()`
- `void setSneezeTicks(int ticks)`
- `int getSneezeTicks()`
- `void setEatingTicks(int ticks)`
- `int getEatingTicks()`
- `void setUnhappyTicks(int ticks)`
- `@Deprecated(forRemoval=true, since="1.19") default void setIsOnBack(boolean onBack)`
- `@Deprecated(forRemoval=true, since="1.19") default void setIsSitting(boolean sitting)`
- `@NotNull @NotNull Panda.Gene getCombinedGene()`
