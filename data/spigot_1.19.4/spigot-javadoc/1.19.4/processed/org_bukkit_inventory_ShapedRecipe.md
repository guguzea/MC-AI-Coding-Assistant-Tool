---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.inventory.ShapedRecipe implements org.bukkit.inventory.Recipe,org.bukkit.Keyed`
- `public org.bukkit.inventory.ShapedRecipe(org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.ShapedRecipe(org.bukkit.NamespacedKey, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.ShapedRecipe shape(java.lang.String...)`
- `public org.bukkit.inventory.ShapedRecipe setIngredient(char, org.bukkit.material.MaterialData)`
- `public org.bukkit.inventory.ShapedRecipe setIngredient(char, org.bukkit.Material)`
- `public org.bukkit.inventory.ShapedRecipe setIngredient(char, org.bukkit.Material, int)`
- `public org.bukkit.inventory.ShapedRecipe setIngredient(char, org.bukkit.inventory.RecipeChoice)`
- `public java.util.Map<java.lang.Character, org.bukkit.inventory.ItemStack> getIngredientMap()`
- `public java.util.Map<java.lang.Character, org.bukkit.inventory.RecipeChoice> getChoiceMap()`
- `public java.lang.String[] getShape()`
- `public org.bukkit.inventory.ItemStack getResult()`
- `public org.bukkit.NamespacedKey getKey()`
- `public java.lang.String getGroup()`
- `public void setGroup(java.lang.String)`
- `public org.bukkit.inventory.recipe.CraftingBookCategory getCategory()`
- `public void setCategory(org.bukkit.inventory.recipe.CraftingBookCategory)`
