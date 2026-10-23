---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/block/Furnace.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `short getBurnTime()`
- `void setBurnTime(short burnTime)`
- `short getCookTime()`
- `void setCookTime(short cookTime)`
- `int getCookTimeTotal()`
- `void setCookTimeTotal(int cookTimeTotal)`
- `@NotNull @NotNull Map<CookingRecipe<?>,Integer> getRecipesUsed()`
- `double getCookSpeedMultiplier()`
- `void setCookSpeedMultiplier(double multiplier)`
- `int getRecipeUsedCount(@NotNull NamespacedKey furnaceRecipe)`
- `boolean hasRecipeUsedCount(@NotNull NamespacedKey furnaceRecipe)`
- `void setRecipeUsedCount(@NotNull CookingRecipe<?> furnaceRecipe, int count)`
- `void setRecipesUsed(@NotNull @NotNull Map<CookingRecipe<?>,Integer> recipesUsed)`
- `@NotNull @NotNull FurnaceInventory getInventory()`
- `@NotNull @NotNull FurnaceInventory getSnapshotInventory()`
