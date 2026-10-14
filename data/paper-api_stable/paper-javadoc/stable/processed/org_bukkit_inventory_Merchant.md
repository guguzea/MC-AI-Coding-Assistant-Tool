---
title: "org.bukkit.inventory.Merchant"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/Merchant.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Merchant**
`public interface Merchant`
- `@NotNull @NotNull List<MerchantRecipe> getRecipes()`
- `void setRecipes(@NotNull @NotNull List<MerchantRecipe> recipes)`
- `@NotNull @NotNull MerchantRecipe getRecipe(int i) throws IndexOutOfBoundsException`
- `void setRecipe(int i, @NotNull @NotNull MerchantRecipe recipe) throws IndexOutOfBoundsException`
- `int getRecipeCount()`
- `boolean isTrading()`
- `@Nullable @Nullable HumanEntity getTrader()`
