---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
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
