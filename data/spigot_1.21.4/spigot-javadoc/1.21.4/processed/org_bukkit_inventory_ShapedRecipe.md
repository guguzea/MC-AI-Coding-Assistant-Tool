---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.inventory.ShapedRecipe extends org.bukkit.inventory.CraftingRecipe`
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
