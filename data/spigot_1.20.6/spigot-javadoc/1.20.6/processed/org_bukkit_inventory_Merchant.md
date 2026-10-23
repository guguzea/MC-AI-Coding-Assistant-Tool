---
title: "org.bukkit.inventory.Merchant"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.Merchant`
- `public abstract java.util.List<org.bukkit.inventory.MerchantRecipe> getRecipes()`
- `public abstract void setRecipes(java.util.List<org.bukkit.inventory.MerchantRecipe>)`
- `public abstract org.bukkit.inventory.MerchantRecipe getRecipe(int) throws java.lang.IndexOutOfBoundsException`
- `public abstract void setRecipe(int, org.bukkit.inventory.MerchantRecipe) throws java.lang.IndexOutOfBoundsException`
- `public abstract int getRecipeCount()`
- `public abstract boolean isTrading()`
- `public abstract org.bukkit.entity.HumanEntity getTrader()`
