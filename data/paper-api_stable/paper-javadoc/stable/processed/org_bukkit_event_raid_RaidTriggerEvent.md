---
title: "org.bukkit.event.raid.RaidTriggerEvent"
package: "org.bukkit.event.raid"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/raid/RaidTriggerEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class RaidTriggerEvent**
`public class RaidTriggerEvent extends RaidEvent implements Cancellable`
- `@Internal public RaidTriggerEvent(@NotNull @NotNull Raid raid, @NotNull @NotNull World world, @NotNull @NotNull Player player)`
- `@NotNull public @NotNull Player getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
