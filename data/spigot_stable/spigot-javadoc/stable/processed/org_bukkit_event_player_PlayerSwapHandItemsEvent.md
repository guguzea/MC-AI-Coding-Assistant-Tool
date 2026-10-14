---
title: "org.bukkit.event.player.PlayerSwapHandItemsEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerSwapHandItemsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerSwapHandItemsEvent**
`public class PlayerSwapHandItemsEvent extends PlayerEvent implements Cancellable`
- `public PlayerSwapHandItemsEvent(@NotNull Player player, @NotNull ItemStack mainHandItem, @NotNull ItemStack offHandItem)`
- `@Nullable public ItemStack getMainHandItem()`
- `public void setMainHandItem(@Nullable ItemStack mainHandItem)`
- `@Nullable public ItemStack getOffHandItem()`
- `public void setOffHandItem(@Nullable ItemStack offHandItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
