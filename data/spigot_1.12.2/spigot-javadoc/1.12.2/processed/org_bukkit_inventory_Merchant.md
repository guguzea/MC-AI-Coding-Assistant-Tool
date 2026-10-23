---
title: "org.bukkit.inventory.Merchant"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.inventory.Merchant`
- `public abstract java.util.List<org.bukkit.inventory.MerchantRecipe> getRecipes()`
- `public abstract void setRecipes(java.util.List<org.bukkit.inventory.MerchantRecipe>)`
- `public abstract org.bukkit.inventory.MerchantRecipe getRecipe(int) throws java.lang.IndexOutOfBoundsException`
- `public abstract void setRecipe(int, org.bukkit.inventory.MerchantRecipe) throws java.lang.IndexOutOfBoundsException`
- `public abstract int getRecipeCount()`
- `public abstract boolean isTrading()`
- `public abstract org.bukkit.entity.HumanEntity getTrader()`
