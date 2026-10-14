---
title: "org.bukkit.event.inventory.HopperInventorySearchEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/HopperInventorySearchEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class HopperInventorySearchEvent**
`public class HopperInventorySearchEvent extends BlockEvent`
- `public HopperInventorySearchEvent(@NotNull Inventory inventory, @NotNull HopperInventorySearchEvent.ContainerType containerType, @NotNull Block hopper, @NotNull Block searchBlock)`
- `public void setInventory(@Nullable Inventory inventory)`
- `@Nullable public Inventory getInventory()`
- `@NotNull public HopperInventorySearchEvent.ContainerType getContainerType()`
- `@NotNull public Block getSearchBlock()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
