---
title: "org.bukkit.inventory.AnvilInventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/AnvilInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AnvilInventory**
`public interface AnvilInventory extends Inventory`
- `@Deprecated(forRemoval=true, since="1.21") @Nullable @Nullable String getRenameText()`
- `@Deprecated(forRemoval=true, since="1.21") int getRepairCostAmount()`
- `@Deprecated(forRemoval=true, since="1.21") void setRepairCostAmount(int amount)`
- `@Deprecated(forRemoval=true, since="1.21") int getRepairCost()`
- `@Deprecated(forRemoval=true, since="1.21") void setRepairCost(int levels)`
- `@Deprecated(forRemoval=true, since="1.21") int getMaximumRepairCost()`
- `@Deprecated(forRemoval=true, since="1.21") void setMaximumRepairCost(int levels)`
- `@Nullable default @Nullable ItemStack getFirstItem()`
- `default void setFirstItem(@Nullable @Nullable ItemStack firstItem)`
- `@Nullable default @Nullable ItemStack getSecondItem()`
- `default void setSecondItem(@Nullable @Nullable ItemStack secondItem)`
- `@Nullable default @Nullable ItemStack getResult()`
- `default void setResult(@Nullable @Nullable ItemStack result)`
