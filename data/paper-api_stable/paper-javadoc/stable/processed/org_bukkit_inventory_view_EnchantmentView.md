---
title: "org.bukkit.inventory.view.EnchantmentView"
package: "org.bukkit.inventory.view"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/view/EnchantmentView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EnchantmentView**
`public interface EnchantmentView extends InventoryView`
- `@NotNull @NotNull EnchantingInventory getTopInventory()`
- `int getEnchantmentSeed()`
- `void setEnchantmentSeed(int seed)`
- `@Nullable EnchantmentOffer @NotNull [] getOffers()`
- `void setOffers(@Nullable EnchantmentOffer @NotNull [] offers) throws IllegalArgumentException`
