---
title: "org.bukkit.inventory.CookingRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/CookingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class CookingRecipe<T extends CookingRecipe>**
`public abstract class CookingRecipe<T extends CookingRecipe> extends Object implements Recipe, Keyed`
- `public CookingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @NotNull @NotNull Material source, float experience, int cookingTime)`
- `public CookingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @NotNull @NotNull RecipeChoice input, float experience, int cookingTime)`
- `@NotNull public @NotNull CookingRecipe setInput(@NotNull @NotNull Material input)`
- `@Deprecated @NotNull public @NotNull ItemStack getInput()`
- `@NotNull public T setInputChoice(@NotNull @NotNull RecipeChoice input)`
- `@NotNull public @NotNull RecipeChoice getInputChoice()`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setExperience(float experience)`
- `public float getExperience()`
- `public void setCookingTime(int cookingTime)`
- `public int getCookingTime()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull String getGroup()`
- `public void setGroup(@NotNull @NotNull String group)`
- `@NotNull public @NotNull CookingBookCategory getCategory()`
- `public void setCategory(@NotNull @NotNull CookingBookCategory category)`
