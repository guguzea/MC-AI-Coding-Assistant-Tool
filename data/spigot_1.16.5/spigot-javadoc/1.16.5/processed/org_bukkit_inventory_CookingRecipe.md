---
title: "org.bukkit.inventory.CookingRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
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
