---
title: "org.bukkit.block.BrewingStand"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/BrewingStand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BrewingStand**
`public interface BrewingStand extends Container`
- `int getBrewingTime()`
- `void setBrewingTime(int brewTime)`
- `void setRecipeBrewTime(@Range(from=1L,to=2147483647L) int recipeBrewTime)`
- `@Range(from=1L,to=2147483647L) int getRecipeBrewTime()`
- `int getFuelLevel()`
- `void setFuelLevel(int level)`
- `@NotNull @NotNull BrewerInventory getInventory()`
- `@NotNull @NotNull BrewerInventory getSnapshotInventory()`
