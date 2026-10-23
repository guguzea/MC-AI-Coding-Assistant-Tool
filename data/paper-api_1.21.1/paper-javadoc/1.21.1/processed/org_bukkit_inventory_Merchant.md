---
title: "org.bukkit.inventory.Merchant"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/inventory/Merchant.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull List<MerchantRecipe> getRecipes()`
- `void setRecipes(@NotNull @NotNull List<MerchantRecipe> recipes)`
- `@NotNull @NotNull MerchantRecipe getRecipe(int i) throws IndexOutOfBoundsException`
- `void setRecipe(int i, @NotNull @NotNull MerchantRecipe recipe) throws IndexOutOfBoundsException`
- `int getRecipeCount()`
- `boolean isTrading()`
- `@Nullable @Nullable HumanEntity getTrader()`
