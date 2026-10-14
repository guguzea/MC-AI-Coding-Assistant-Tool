---
title: "org.bukkit.event.player.PlayerItemConsumeEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerItemConsumeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerItemConsumeEvent**
`public class PlayerItemConsumeEvent extends PlayerEvent implements Cancellable`
- `public PlayerItemConsumeEvent(@NotNull Player player, @NotNull ItemStack item, @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2") public PlayerItemConsumeEvent(@NotNull Player player, @NotNull ItemStack item)`
- `@NotNull public ItemStack getItem()`
- `public void setItem(@Nullable ItemStack item)`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
