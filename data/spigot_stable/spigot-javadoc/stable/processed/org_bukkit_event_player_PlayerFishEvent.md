---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerFishEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerFishEvent**
`public class PlayerFishEvent extends PlayerEvent implements Cancellable`
- `public PlayerFishEvent(@NotNull Player player, @Nullable Entity entity, @NotNull FishHook hookEntity, @Nullable EquipmentSlot hand, @NotNull PlayerFishEvent.State state)`
- `public PlayerFishEvent(@NotNull Player player, @Nullable Entity entity, @NotNull FishHook hookEntity, @NotNull PlayerFishEvent.State state)`
- `@Nullable public Entity getCaught()`
- `@NotNull public FishHook getHook()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public int getExpToDrop()`
- `public void setExpToDrop(int amount)`
- `@Nullable public EquipmentSlot getHand()`
- `@NotNull public PlayerFishEvent.State getState()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
