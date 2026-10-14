---
title: "org.bukkit.inventory.view.AnvilView"
package: "org.bukkit.inventory.view"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/view/AnvilView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AnvilView**
`public interface AnvilView extends InventoryView`
- `@NotNull @NotNull AnvilInventory getTopInventory()`
- `@Nullable @Nullable String getRenameText()`
- `int getRepairItemCountCost()`
- `int getRepairCost()`
- `int getMaximumRepairCost()`
- `void setRepairItemCountCost(int amount)`
- `void setRepairCost(int cost)`
- `void setMaximumRepairCost(int levels)`
- `boolean bypassesEnchantmentLevelRestriction()`
- `void bypassEnchantmentLevelRestriction(boolean bypassEnchantmentLevelRestriction)`
