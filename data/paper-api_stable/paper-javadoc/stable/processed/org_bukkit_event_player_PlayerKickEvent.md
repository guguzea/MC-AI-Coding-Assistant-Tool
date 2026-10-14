---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerKickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerKickEvent**
`@NullMarked public class PlayerKickEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public PlayerKickEvent(Player playerKicked, String kickReason, String leaveMessage)`
- `@Internal @Deprecated(forRemoval=true) public PlayerKickEvent(Player playerKicked, Component kickReason, Component leaveMessage)`
- `@Internal public PlayerKickEvent(Player playerKicked, Component kickReason, Component leaveMessage, PlayerKickEvent.Cause cause)`
- `public Component reason()`
- `public void reason(Component kickReason)`
- `@Deprecated public String getReason()`
- `@Deprecated public void setReason(String kickReason)`
- `public @Nullable Component leaveMessage()`
- `public void leaveMessage(@Nullable Component leaveMessage)`
- `@Deprecated public @Nullable String getLeaveMessage()`
- `@Deprecated public void setLeaveMessage(@Nullable String leaveMessage)`
- `public PlayerKickEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
