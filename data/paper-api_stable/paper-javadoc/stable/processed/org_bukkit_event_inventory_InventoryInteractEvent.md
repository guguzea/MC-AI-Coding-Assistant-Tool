---
title: "org.bukkit.event.inventory.InventoryInteractEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/InventoryInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InventoryInteractEvent**
`public abstract class InventoryInteractEvent extends InventoryEvent implements Cancellable`
- `@Internal public InventoryInteractEvent(@NotNull @NotNull InventoryView transaction)`
- `@NotNull public @NotNull HumanEntity getWhoClicked()`
- `public void setResult(@NotNull @NotNull Event.Result newResult)`
- `@NotNull public @NotNull Event.Result getResult()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
