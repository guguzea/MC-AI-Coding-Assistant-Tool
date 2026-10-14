---
title: "org.bukkit.event.inventory.CraftItemEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/CraftItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class CraftItemEvent**
`public class CraftItemEvent extends InventoryClickEvent`
- `@Internal public CraftItemEvent(@NotNull @NotNull Recipe recipe, @NotNull @NotNull InventoryView view, @NotNull @NotNull InventoryType.SlotType type, int slot, @NotNull @NotNull ClickType click, @NotNull @NotNull InventoryAction action)`
- `@Internal public CraftItemEvent(@NotNull @NotNull Recipe recipe, @NotNull @NotNull InventoryView view, @NotNull @NotNull InventoryType.SlotType type, int slot, @NotNull @NotNull ClickType click, @NotNull @NotNull InventoryAction action, int key)`
- `@NotNull public @NotNull CraftingInventory getInventory()`
- `@NotNull public @NotNull Recipe getRecipe()`
