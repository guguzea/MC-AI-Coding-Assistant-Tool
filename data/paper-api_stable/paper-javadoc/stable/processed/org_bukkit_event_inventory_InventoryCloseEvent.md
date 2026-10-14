---
title: "org.bukkit.event.inventory.InventoryCloseEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/InventoryCloseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InventoryCloseEvent**
`public class InventoryCloseEvent extends InventoryEvent`
- `@Internal public InventoryCloseEvent(@NotNull @NotNull InventoryView transaction)`
- `@Internal public InventoryCloseEvent(@NotNull @NotNull InventoryView transaction, @NotNull @NotNull InventoryCloseEvent.Reason reason)`
- `@NotNull public final @NotNull HumanEntity getPlayer()`
- `@NotNull public @NotNull InventoryCloseEvent.Reason getReason()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
