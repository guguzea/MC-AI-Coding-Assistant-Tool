---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerKickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public PlayerKickEvent(@NotNull @NotNull Player playerKicked, @NotNull @NotNull String kickReason, @NotNull @NotNull String leaveMessage)`
- `@Deprecated(forRemoval=true) public PlayerKickEvent(@NotNull @NotNull Player playerKicked, @NotNull Component kickReason, @NotNull Component leaveMessage)`
- `@Internal public PlayerKickEvent(@NotNull @NotNull Player playerKicked, @NotNull Component kickReason, @NotNull Component leaveMessage, @NotNull @NotNull PlayerKickEvent.Cause cause)`
- `public @NotNull Component leaveMessage()`
- `public void leaveMessage(@NotNull Component leaveMessage)`
- `public @NotNull Component reason()`
- `public void reason(@NotNull Component kickReason)`
- `@NotNull @Deprecated public @NotNull String getReason()`
- `@NotNull @Deprecated public @NotNull String getLeaveMessage()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Deprecated public void setReason(@NotNull @NotNull String kickReason)`
- `@Deprecated public void setLeaveMessage(@NotNull @NotNull String leaveMessage)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public PlayerKickEvent.Cause getCause()`
