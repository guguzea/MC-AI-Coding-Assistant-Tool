---
title: "org.bukkit.event.player.PlayerItemDamageEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerItemDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerItemDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack what, int damage)`
- `public PlayerItemDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack what, int damage, int originalDamage)`
- `@NotNull public @NotNull ItemStack getItem()`
- `public int getDamage()`
- `public int getOriginalDamage()`
- `public void setDamage(int damage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
