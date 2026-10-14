---
title: "org.bukkit.event.player.PlayerSwapHandItemsEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerSwapHandItemsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerSwapHandItemsEvent**
`public class PlayerSwapHandItemsEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerSwapHandItemsEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack mainHandItem, @NotNull @NotNull ItemStack offHandItem)`
- `@NotNull public @NotNull ItemStack getMainHandItem()`
- `public void setMainHandItem(@Nullable @Nullable ItemStack mainHandItem)`
- `@NotNull public @NotNull ItemStack getOffHandItem()`
- `public void setOffHandItem(@Nullable @Nullable ItemStack offHandItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
