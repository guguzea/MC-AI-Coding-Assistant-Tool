---
title: "org.bukkit.event.player.PlayerItemDamageEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerItemDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public PlayerItemDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack what, int damage)`
- `@Internal public PlayerItemDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack what, int damage, int originalDamage)`
- `@NotNull public @NotNull ItemStack getItem()`
- `public int getDamage()`
- `public int getOriginalDamage()`
- `public void setDamage(int damage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
