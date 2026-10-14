---
title: "org.bukkit.inventory.Merchant"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/Merchant.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Merchant**
`public interface Merchant`
- `@NotNull List<MerchantRecipe> getRecipes()`
- `void setRecipes(@NotNull List<MerchantRecipe> recipes)`
- `@NotNull MerchantRecipe getRecipe(int i) throws IndexOutOfBoundsException`
- `void setRecipe(int i, @NotNull MerchantRecipe recipe) throws IndexOutOfBoundsException`
- `int getRecipeCount()`
- `boolean isTrading()`
- `@Nullable HumanEntity getTrader()`
