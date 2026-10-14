---
title: "org.bukkit.event.inventory.CraftItemEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/CraftItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class CraftItemEvent**
`public class CraftItemEvent extends InventoryClickEvent`
- `public CraftItemEvent(@NotNull Recipe recipe, @NotNull InventoryView what, @NotNull InventoryType.SlotType type, int slot, @NotNull ClickType click, @NotNull InventoryAction action)`
- `public CraftItemEvent(@NotNull Recipe recipe, @NotNull InventoryView what, @NotNull InventoryType.SlotType type, int slot, @NotNull ClickType click, @NotNull InventoryAction action, int key)`
- `@NotNull public Recipe getRecipe()`
- `@NotNull public CraftingInventory getInventory()`
