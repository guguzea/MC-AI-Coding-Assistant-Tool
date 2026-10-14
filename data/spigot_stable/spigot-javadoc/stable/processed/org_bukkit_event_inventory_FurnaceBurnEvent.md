---
title: "org.bukkit.event.inventory.FurnaceBurnEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/FurnaceBurnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class FurnaceBurnEvent**
`public class FurnaceBurnEvent extends BlockEvent implements Cancellable`
- `public FurnaceBurnEvent(@NotNull Block furnace, @NotNull ItemStack fuel, int burnTime)`
- `@NotNull public ItemStack getFuel()`
- `public int getBurnTime()`
- `public void setBurnTime(int burnTime)`
- `public boolean isBurning()`
- `public void setBurning(boolean burning)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
