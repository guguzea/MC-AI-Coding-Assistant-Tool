---
title: "org.bukkit.inventory.CraftingInventory"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/CraftingInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface CraftingInventory**
`public interface CraftingInventory extends Inventory`
- `@Nullable ItemStack getResult()`
- `@NotNull ItemStack[] getMatrix()`
- `void setResult(@Nullable ItemStack newResult)`
- `void setMatrix(@NotNull ItemStack[] contents)`
- `@Nullable Recipe getRecipe()`
