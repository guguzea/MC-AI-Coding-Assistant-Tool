---
title: "org.bukkit.event.player.PlayerSwapHandItemsEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerSwapHandItemsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public PlayerSwapHandItemsEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack mainHandItem, @NotNull @NotNull ItemStack offHandItem)`
- `@NotNull public @NotNull ItemStack getMainHandItem()`
- `public void setMainHandItem(@Nullable @Nullable ItemStack mainHandItem)`
- `@NotNull public @NotNull ItemStack getOffHandItem()`
- `public void setOffHandItem(@Nullable @Nullable ItemStack offHandItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
