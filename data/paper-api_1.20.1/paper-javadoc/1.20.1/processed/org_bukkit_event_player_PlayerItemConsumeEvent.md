---
title: "org.bukkit.event.player.PlayerItemConsumeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerItemConsumeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerItemConsumeEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot hand)`
- `@Deprecated public PlayerItemConsumeEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ItemStack getItem()`
- `public void setItem(@Nullable @Nullable ItemStack item)`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@Nullable public @Nullable ItemStack getReplacement()`
- `public void setReplacement(@Nullable @Nullable ItemStack replacement)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
