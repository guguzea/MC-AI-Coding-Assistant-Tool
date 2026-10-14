---
title: "org.bukkit.event.player.PlayerInteractEntityEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerInteractEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerInteractEntityEvent**
`public class PlayerInteractEntityEvent extends PlayerEvent implements Cancellable`
- `protected Entity clickedEntity`
- `public PlayerInteractEntityEvent(@NotNull Player who, @NotNull Entity clickedEntity)`
- `public PlayerInteractEntityEvent(@NotNull Player who, @NotNull Entity clickedEntity, @NotNull EquipmentSlot hand)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Entity getRightClicked()`
- `@NotNull public EquipmentSlot getHand()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
