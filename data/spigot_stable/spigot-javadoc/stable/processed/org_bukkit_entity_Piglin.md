---
title: "org.bukkit.entity.Piglin"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Piglin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Piglin**
`public interface Piglin extends PiglinAbstract, InventoryHolder`
- `boolean isAbleToHunt()`
- `void setIsAbleToHunt(boolean flag)`
- `boolean addBarterMaterial(@NotNull Material material)`
- `boolean removeBarterMaterial(@NotNull Material material)`
- `boolean addMaterialOfInterest(@NotNull Material material)`
- `boolean removeMaterialOfInterest(@NotNull Material material)`
- `@NotNull Set<Material> getInterestList()`
- `@NotNull Set<Material> getBarterList()`
