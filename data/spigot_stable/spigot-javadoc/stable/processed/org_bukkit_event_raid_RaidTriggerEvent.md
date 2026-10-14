---
title: "org.bukkit.event.raid.RaidTriggerEvent"
package: "org.bukkit.event.raid"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/raid/RaidTriggerEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class RaidTriggerEvent**
`public class RaidTriggerEvent extends RaidEvent implements Cancellable`
- `public RaidTriggerEvent(@NotNull Raid raid, @NotNull World world, @NotNull Player player)`
- `@NotNull public Player getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
