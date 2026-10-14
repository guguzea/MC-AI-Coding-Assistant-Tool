---
title: "org.bukkit.event.inventory.HopperInventorySearchEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/HopperInventorySearchEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class HopperInventorySearchEvent**
`public class HopperInventorySearchEvent extends BlockEvent`
- `@Internal public HopperInventorySearchEvent(@Nullable @Nullable Inventory inventory, @NotNull @NotNull HopperInventorySearchEvent.ContainerType containerType, @NotNull @NotNull Block hopper, @NotNull @NotNull Block searchBlock)`
- `public void setInventory(@Nullable @Nullable Inventory inventory)`
- `@Nullable public @Nullable Inventory getInventory()`
- `@NotNull public @NotNull HopperInventorySearchEvent.ContainerType getContainerType()`
- `@NotNull public @NotNull Block getSearchBlock()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
