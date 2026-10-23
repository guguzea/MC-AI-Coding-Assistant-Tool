---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerFishEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerFishEvent(@NotNull @NotNull Player player, @Nullable @Nullable Entity entity, @NotNull @NotNull FishHook hookEntity, @Nullable @Nullable EquipmentSlot hand, @NotNull @NotNull PlayerFishEvent.State state)`
- `public PlayerFishEvent(@NotNull @NotNull Player player, @Nullable @Nullable Entity entity, @NotNull @NotNull FishHook hookEntity, @NotNull @NotNull PlayerFishEvent.State state)`
- `@Nullable public @Nullable Entity getCaught()`
- `@NotNull public @NotNull FishHook getHook()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public int getExpToDrop()`
- `public void setExpToDrop(int amount)`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@NotNull public @NotNull PlayerFishEvent.State getState()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
