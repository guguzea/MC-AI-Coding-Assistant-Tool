---
title: "org.bukkit.inventory.CookingRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public abstract class org.bukkit.inventory.CookingRecipe<T extends org.bukkit.inventory.CookingRecipe> implements org.bukkit.inventory.Recipe, org.bukkit.Keyed`
- `public org.bukkit.inventory.CookingRecipe(org.bukkit.NamespacedKey, org.bukkit.inventory.ItemStack, org.bukkit.Material, float, int)`
- `public org.bukkit.inventory.CookingRecipe(org.bukkit.NamespacedKey, org.bukkit.inventory.ItemStack, org.bukkit.inventory.RecipeChoice, float, int)`
- `public org.bukkit.inventory.CookingRecipe setInput(org.bukkit.Material)`
- `public org.bukkit.inventory.ItemStack getInput()`
- `public T setInputChoice(org.bukkit.inventory.RecipeChoice)`
- `public org.bukkit.inventory.RecipeChoice getInputChoice()`
- `public org.bukkit.inventory.ItemStack getResult()`
- `public void setExperience(float)`
- `public float getExperience()`
- `public void setCookingTime(int)`
- `public int getCookingTime()`
- `public org.bukkit.NamespacedKey getKey()`
- `public java.lang.String getGroup()`
- `public void setGroup(java.lang.String)`
- `public org.bukkit.inventory.recipe.CookingBookCategory getCategory()`
- `public void setCategory(org.bukkit.inventory.recipe.CookingBookCategory)`
