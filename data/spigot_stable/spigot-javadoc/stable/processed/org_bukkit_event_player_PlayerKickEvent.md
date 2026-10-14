---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerKickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerKickEvent**
`public class PlayerKickEvent extends PlayerEvent implements Cancellable`
- `public PlayerKickEvent(@NotNull Player playerKicked, @NotNull String kickReason, @NotNull String leaveMessage)`
- `@NotNull public String getReason()`
- `@NotNull public String getLeaveMessage()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public void setReason(@NotNull String kickReason)`
- `public void setLeaveMessage(@NotNull String leaveMessage)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
