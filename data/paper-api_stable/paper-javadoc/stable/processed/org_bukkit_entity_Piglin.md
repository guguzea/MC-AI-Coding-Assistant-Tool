---
title: "org.bukkit.entity.Piglin"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Piglin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Piglin**
`public interface Piglin extends PiglinAbstract, InventoryHolder, RangedEntity`
- `boolean isAbleToHunt()`
- `void setIsAbleToHunt(boolean flag)`
- `boolean addBarterMaterial(@NotNull @NotNull Material material)`
- `boolean removeBarterMaterial(@NotNull @NotNull Material material)`
- `boolean addMaterialOfInterest(@NotNull @NotNull Material material)`
- `boolean removeMaterialOfInterest(@NotNull @NotNull Material material)`
- `@NotNull @NotNull Set<Material> getInterestList()`
- `@NotNull @NotNull Set<Material> getBarterList()`
- `void setChargingCrossbow(boolean chargingCrossbow)`
- `boolean isChargingCrossbow()`
- `void setDancing(boolean dancing)`
- `void setDancing(long duration)`
- `boolean isDancing()`
