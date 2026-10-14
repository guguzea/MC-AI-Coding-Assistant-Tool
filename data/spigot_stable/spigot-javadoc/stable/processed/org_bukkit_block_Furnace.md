---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Furnace.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Furnace**
`public interface Furnace extends Container`
- `short getBurnTime()`
- `void setBurnTime(short burnTime)`
- `short getCookTime()`
- `void setCookTime(short cookTime)`
- `int getCookTimeTotal()`
- `void setCookTimeTotal(int cookTimeTotal)`
- `@NotNull Map<CookingRecipe<?>, Integer> getRecipesUsed()`
- `@NotNull FurnaceInventory getInventory()`
- `@NotNull FurnaceInventory getSnapshotInventory()`
