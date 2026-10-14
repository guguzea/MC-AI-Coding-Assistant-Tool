---
title: "org.bukkit.event.inventory.InventoryOpenEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/InventoryOpenEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InventoryOpenEvent**
`public class InventoryOpenEvent extends InventoryEvent implements Cancellable`
- `public InventoryOpenEvent(@NotNull InventoryView transaction)`
- `@NotNull public final HumanEntity getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
