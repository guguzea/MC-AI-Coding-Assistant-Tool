---
title: "org.bukkit.event.inventory.InventoryInteractEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/InventoryInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InventoryInteractEvent**
`public abstract class InventoryInteractEvent extends InventoryEvent implements Cancellable`
- `public InventoryInteractEvent(@NotNull InventoryView transaction)`
- `@NotNull public HumanEntity getWhoClicked()`
- `public void setResult(@NotNull Event.Result newResult)`
- `@NotNull public Event.Result getResult()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean toCancel)`
