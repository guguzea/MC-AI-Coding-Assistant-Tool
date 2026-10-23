---
title: "org.bukkit.event.inventory.FurnaceBurnEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/inventory/FurnaceBurnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public FurnaceBurnEvent(@NotNull @NotNull Block furnace, @NotNull @NotNull ItemStack fuel, int burnTime)`
- `@NotNull public @NotNull ItemStack getFuel()`
- `public int getBurnTime()`
- `public void setBurnTime(@org.jetbrains.annotations.Range(from=-32768L, to=32767L) int burnTime)`
- `public boolean isBurning()`
- `public void setBurning(boolean burning)`
- `public boolean willConsumeFuel()`
- `public void setConsumeFuel(boolean consumeFuel)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
