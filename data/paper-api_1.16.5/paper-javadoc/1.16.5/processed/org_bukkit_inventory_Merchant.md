---
title: "org.bukkit.inventory.Merchant"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/Merchant.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull List<MerchantRecipe> getRecipes()`
- `void setRecipes&#8203;(@NotNull @NotNull List<MerchantRecipe> recipes)`
- `@NotNull @NotNull MerchantRecipe getRecipe&#8203;(int i) throws IndexOutOfBoundsException`
- `void setRecipe&#8203;(int i, @NotNull @NotNull MerchantRecipe recipe) throws IndexOutOfBoundsException`
- `int getRecipeCount()`
- `boolean isTrading()`
- `@Nullable @Nullable HumanEntity getTrader()`
