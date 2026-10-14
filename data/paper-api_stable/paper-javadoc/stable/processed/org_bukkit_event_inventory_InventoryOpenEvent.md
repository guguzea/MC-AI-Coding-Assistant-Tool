---
title: "org.bukkit.event.inventory.InventoryOpenEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/InventoryOpenEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InventoryOpenEvent**
`public class InventoryOpenEvent extends InventoryEvent implements Cancellable`
- `@Internal public InventoryOpenEvent(@NotNull @NotNull InventoryView transaction)`
- `@NotNull public final @NotNull HumanEntity getPlayer()`
- `@Nullable public @Nullable Component titleOverride()`
- `public void titleOverride(@Nullable @Nullable Component titleOverride)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
