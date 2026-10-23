---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerKickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerKickEvent&#8203;(@NotNull @NotNull Player playerKicked, @NotNull @NotNull String kickReason, @NotNull @NotNull String leaveMessage)`
- `@Deprecated public PlayerKickEvent&#8203;(@NotNull @NotNull Player playerKicked, @NotNull Component kickReason, @NotNull Component leaveMessage)`
- `public PlayerKickEvent&#8203;(@NotNull @NotNull Player playerKicked, @NotNull Component kickReason, @NotNull Component leaveMessage, @NotNull @NotNull PlayerKickEvent.Cause cause)`
- `@NotNull public Component leaveMessage()`
- `public void leaveMessage&#8203;(@NotNull Component leaveMessage)`
- `@NotNull public Component reason()`
- `public void reason&#8203;(@NotNull Component kickReason)`
- `@NotNull @Deprecated public @NotNull String getReason()`
- `@NotNull @Deprecated public @NotNull String getLeaveMessage()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@Deprecated public void setReason&#8203;(@NotNull @NotNull String kickReason)`
- `@Deprecated public void setLeaveMessage&#8203;(@NotNull @NotNull String leaveMessage)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public PlayerKickEvent.Cause getCause()`
