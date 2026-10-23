---
title: "org.bukkit.inventory.CraftingRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public abstract class org.bukkit.inventory.CraftingRecipe implements org.bukkit.inventory.Recipe,org.bukkit.Keyed`
- `protected org.bukkit.inventory.CraftingRecipe(org.bukkit.NamespacedKey, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.NamespacedKey getKey()`
- `public org.bukkit.inventory.ItemStack getResult()`
- `public java.lang.String getGroup()`
- `public void setGroup(java.lang.String)`
- `public org.bukkit.inventory.recipe.CraftingBookCategory getCategory()`
- `public void setCategory(org.bukkit.inventory.recipe.CraftingBookCategory)`
- `protected static org.bukkit.inventory.ItemStack checkResult(org.bukkit.inventory.ItemStack)`
