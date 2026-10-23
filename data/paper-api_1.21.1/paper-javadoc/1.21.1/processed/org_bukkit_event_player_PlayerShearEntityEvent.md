---
title: "org.bukkit.event.player.PlayerShearEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerShearEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerShearEntityEvent(@NotNull @NotNull Player who, @NotNull @NotNull Entity what, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot hand, @NotNull List<ItemStack> drops)`
- `@Deprecated public PlayerShearEntityEvent(@NotNull @NotNull Player who, @NotNull @NotNull Entity what)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public @NotNull @Unmodifiable List<ItemStack> getDrops()`
- `public void setDrops(@NotNull List<ItemStack> drops)`
