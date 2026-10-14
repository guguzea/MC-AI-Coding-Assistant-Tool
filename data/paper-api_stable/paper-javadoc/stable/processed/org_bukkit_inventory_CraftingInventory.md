---
title: "org.bukkit.inventory.CraftingInventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/CraftingInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CraftingInventory**
`public interface CraftingInventory extends Inventory`
- `@Nullable @Nullable ItemStack getResult()`
- `@Nullable @Nullable ItemStack @NotNull [] getMatrix()`
- `void setResult(@Nullable @Nullable ItemStack newResult)`
- `void setMatrix(@Nullable @Nullable ItemStack @NotNull [] contents)`
- `@Nullable @Nullable Recipe getRecipe()`
