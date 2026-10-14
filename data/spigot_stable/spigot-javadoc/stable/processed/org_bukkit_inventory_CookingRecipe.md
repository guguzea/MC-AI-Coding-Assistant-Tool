---
title: "org.bukkit.inventory.CookingRecipe"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/CookingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class CookingRecipe<T extends CookingRecipe>**
`public abstract class CookingRecipe<T extends CookingRecipe> extends Object implements Recipe, Keyed`
- `public CookingRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result, @NotNull Material source, float experience, int cookingTime)`
- `public CookingRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result, @NotNull RecipeChoice input, float experience, int cookingTime)`
- `@NotNull public CookingRecipe setInput(@NotNull Material input)`
- `@NotNull public ItemStack getInput()`
- `@NotNull public T setInputChoice(@NotNull RecipeChoice input)`
- `@NotNull public RecipeChoice getInputChoice()`
- `@NotNull public ItemStack getResult()`
- `public void setExperience(float experience)`
- `public float getExperience()`
- `public void setCookingTime(int cookingTime)`
- `public int getCookingTime()`
- `@NotNull public NamespacedKey getKey()`
- `@NotNull public String getGroup()`
- `public void setGroup(@NotNull String group)`
- `@NotNull public CookingBookCategory getCategory()`
- `public void setCategory(@NotNull CookingBookCategory category)`
