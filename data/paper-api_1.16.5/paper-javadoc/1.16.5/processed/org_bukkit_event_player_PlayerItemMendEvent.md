---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerItemMendEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerItemMendEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount&#8203;(int amount)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
