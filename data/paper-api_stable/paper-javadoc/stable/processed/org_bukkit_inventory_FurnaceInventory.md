---
title: "org.bukkit.inventory.FurnaceInventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/FurnaceInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface FurnaceInventory**
`public interface FurnaceInventory extends Inventory`
- `@Nullable @Nullable ItemStack getResult()`
- `@Nullable @Nullable ItemStack getFuel()`
- `@Nullable @Nullable ItemStack getSmelting()`
- `void setFuel(@Nullable @Nullable ItemStack stack)`
- `void setResult(@Nullable @Nullable ItemStack stack)`
- `void setSmelting(@Nullable @Nullable ItemStack stack)`
- `boolean isFuel(@Nullable @Nullable ItemStack item)`
- `boolean canSmelt(@Nullable @Nullable ItemStack item)`
- `@Nullable @Nullable Furnace getHolder()`
