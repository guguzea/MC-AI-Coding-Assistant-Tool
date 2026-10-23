---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerKickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerKickEvent(@NotNull @NotNull Player playerKicked, @NotNull @NotNull String kickReason, @NotNull @NotNull String leaveMessage)`
- `@Deprecated public PlayerKickEvent(@NotNull @NotNull Player playerKicked, @NotNull Component kickReason, @NotNull Component leaveMessage)`
- `public PlayerKickEvent(@NotNull @NotNull Player playerKicked, @NotNull Component kickReason, @NotNull Component leaveMessage, @NotNull @NotNull PlayerKickEvent.Cause cause)`
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
