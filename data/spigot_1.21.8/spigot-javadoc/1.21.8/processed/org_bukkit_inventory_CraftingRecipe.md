---
title: "org.bukkit.inventory.CraftingRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
