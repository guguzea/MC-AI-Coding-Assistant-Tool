---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Furnace.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Furnace**
`public interface Furnace extends Container`
- `short getBurnTime()`
- `void setBurnTime(short burnTime)`
- `short getCookTime()`
- `void setCookTime(short cookTime)`
- `int getCookTimeTotal()`
- `void setCookTimeTotal(int cookTimeTotal)`
- `@NotNull @NotNull Map<CookingRecipe<?>, Integer> getRecipesUsed()`
- `double getCookSpeedMultiplier()`
- `void setCookSpeedMultiplier(double multiplier)`
- `int getRecipeUsedCount(@NotNull NamespacedKey furnaceRecipe)`
- `boolean hasRecipeUsedCount(@NotNull NamespacedKey furnaceRecipe)`
- `void setRecipeUsedCount(@NotNull CookingRecipe<?> furnaceRecipe, int count)`
- `void setRecipesUsed(@NotNull @NotNull Map<CookingRecipe<?>, Integer> recipesUsed)`
- `@NotNull @NotNull FurnaceInventory getInventory()`
- `@NotNull @NotNull FurnaceInventory getSnapshotInventory()`
