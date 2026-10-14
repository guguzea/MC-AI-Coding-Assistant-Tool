---
title: "org.bukkit.event.player.PlayerShearEntityEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerShearEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerShearEntityEvent**
`public class PlayerShearEntityEvent extends PlayerEvent implements Cancellable`
- `public PlayerShearEntityEvent(@NotNull Player who, @NotNull Entity what, @NotNull ItemStack item, @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.15.2") public PlayerShearEntityEvent(@NotNull Player who, @NotNull Entity what)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Entity getEntity()`
- `@NotNull public ItemStack getItem()`
- `@NotNull public EquipmentSlot getHand()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
