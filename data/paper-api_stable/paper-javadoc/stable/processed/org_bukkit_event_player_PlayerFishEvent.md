---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerFishEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerFishEvent**
`public class PlayerFishEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerFishEvent(@NotNull @NotNull Player player, @Nullable @Nullable Entity entity, @NotNull @NotNull FishHook hookEntity, @Nullable @Nullable EquipmentSlot hand, @NotNull @NotNull PlayerFishEvent.State state)`
- `@Internal public PlayerFishEvent(@NotNull @NotNull Player player, @Nullable @Nullable Entity entity, @NotNull @NotNull FishHook hookEntity, @NotNull @NotNull PlayerFishEvent.State state)`
- `@Nullable public @Nullable Entity getCaught()`
- `@NotNull public @NotNull FishHook getHook()`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@NotNull public @NotNull PlayerFishEvent.State getState()`
- `public int getExpToDrop()`
- `public void setExpToDrop(int amount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
