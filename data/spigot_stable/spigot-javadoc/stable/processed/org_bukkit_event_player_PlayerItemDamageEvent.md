---
title: "org.bukkit.event.player.PlayerItemDamageEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerItemDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerItemDamageEvent**
`public class PlayerItemDamageEvent extends PlayerEvent implements Cancellable`
- `public PlayerItemDamageEvent(@NotNull Player player, @NotNull ItemStack what, int damage)`
- `@NotNull public ItemStack getItem()`
- `public int getDamage()`
- `public void setDamage(int damage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
