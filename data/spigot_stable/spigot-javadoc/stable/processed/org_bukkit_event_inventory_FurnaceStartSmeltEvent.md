---
title: "org.bukkit.event.inventory.FurnaceStartSmeltEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/FurnaceStartSmeltEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class FurnaceStartSmeltEvent**
`public class FurnaceStartSmeltEvent extends InventoryBlockStartEvent`
- `public FurnaceStartSmeltEvent(@NotNull Block furnace, @NotNull ItemStack source, @NotNull CookingRecipe<?> recipe)`
- `@NotNull public CookingRecipe<?> getRecipe()`
- `public int getTotalCookTime()`
- `public void setTotalCookTime(int cookTime)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
