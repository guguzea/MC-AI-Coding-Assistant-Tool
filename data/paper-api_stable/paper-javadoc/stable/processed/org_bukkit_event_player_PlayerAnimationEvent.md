---
title: "org.bukkit.event.player.PlayerAnimationEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerAnimationEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerAnimationEvent**
`@Deprecated(since="26.3") public class PlayerAnimationEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(since="1.19", forRemoval=true) public PlayerAnimationEvent(@NotNull @NotNull Player player)`
- `@Internal public PlayerAnimationEvent(@NotNull @NotNull Player player, @NotNull @NotNull PlayerAnimationType playerAnimationType)`
- `@NotNull public @NotNull PlayerAnimationType getAnimationType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
