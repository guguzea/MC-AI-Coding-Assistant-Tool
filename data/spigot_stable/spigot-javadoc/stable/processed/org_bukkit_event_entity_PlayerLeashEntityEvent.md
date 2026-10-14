---
title: "org.bukkit.event.entity.PlayerLeashEntityEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/PlayerLeashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerLeashEntityEvent**
`public class PlayerLeashEntityEvent extends Event implements Cancellable`
- `public PlayerLeashEntityEvent(@NotNull Entity what, @NotNull Entity leashHolder, @NotNull Player leasher, @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2") public PlayerLeashEntityEvent(@NotNull Entity what, @NotNull Entity leashHolder, @NotNull Player leasher)`
- `@NotNull public Entity getLeashHolder()`
- `@NotNull public Entity getEntity()`
- `@NotNull public final Player getPlayer()`
- `@NotNull public EquipmentSlot getHand()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
