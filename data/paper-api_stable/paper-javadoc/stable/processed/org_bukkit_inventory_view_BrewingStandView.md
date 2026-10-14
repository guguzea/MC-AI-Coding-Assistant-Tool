---
title: "org.bukkit.inventory.view.BrewingStandView"
package: "org.bukkit.inventory.view"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/view/BrewingStandView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BrewingStandView**
`public interface BrewingStandView extends InventoryView`
- `@NotNull @NotNull BrewerInventory getTopInventory()`
- `int getFuelLevel()`
- `int getBrewingTicks()`
- `void setFuelLevel(int level) throws IllegalArgumentException`
- `void setBrewingTicks(int ticks) throws IllegalArgumentException`
- `void setRecipeBrewTime(@Range(from=1L,to=2147483647L) int recipeBrewTime)`
- `@Range(from=1L,to=2147483647L) int getRecipeBrewTime()`
