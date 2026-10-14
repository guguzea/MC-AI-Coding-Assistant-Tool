---
title: "org.bukkit.event.inventory.FurnaceStartSmeltEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/FurnaceStartSmeltEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class FurnaceStartSmeltEvent**
`public class FurnaceStartSmeltEvent extends InventoryBlockStartEvent`
- `@Internal @Deprecated(forRemoval=true) public FurnaceStartSmeltEvent(@NotNull @NotNull Block furnace, @NotNull @NotNull ItemStack source, @NotNull @NotNull CookingRecipe<?> recipe)`
- `@Internal public FurnaceStartSmeltEvent(@NotNull @NotNull Block furnace, @NotNull @NotNull ItemStack source, @NotNull @NotNull CookingRecipe<?> recipe, int cookingTime)`
- `@NotNull public @NotNull CookingRecipe<?> getRecipe()`
- `public int getTotalCookTime()`
- `public void setTotalCookTime(int cookTime)`
