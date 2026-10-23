---
title: "org.bukkit.inventory.CookingRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/CookingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public CookingRecipe&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @NotNull @NotNull Material source, float experience, int cookingTime)`
- `public CookingRecipe&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @NotNull @NotNull RecipeChoice input, float experience, int cookingTime)`
- `@NotNull public @NotNull CookingRecipe setInput&#8203;(@NotNull @NotNull Material input)`
- `@NotNull public @NotNull ItemStack getInput()`
- `@NotNull public T setInputChoice&#8203;(@NotNull @NotNull RecipeChoice input)`
- `@NotNull public @NotNull RecipeChoice getInputChoice()`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setExperience&#8203;(float experience)`
- `public float getExperience()`
- `public void setCookingTime&#8203;(int cookingTime)`
- `public int getCookingTime()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull String getGroup()`
- `public void setGroup&#8203;(@NotNull @NotNull String group)`
