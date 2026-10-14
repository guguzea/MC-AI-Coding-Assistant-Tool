---
title: "org.bukkit.event.player.PlayerItemDamageEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerItemDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerItemDamageEvent**
`public class PlayerItemDamageEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public PlayerItemDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, int damage)`
- `@Internal public PlayerItemDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, int damage, int originalDamage)`
- `@NotNull public @NotNull ItemStack getItem()`
- `public int getDamage()`
- `public void setDamage(int damage)`
- `public int getOriginalDamage()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
