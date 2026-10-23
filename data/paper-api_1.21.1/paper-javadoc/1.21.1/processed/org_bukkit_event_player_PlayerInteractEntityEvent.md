---
title: "org.bukkit.event.player.PlayerInteractEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerInteractEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected Entity clickedEntity`
- `public PlayerInteractEntityEvent(@NotNull @NotNull Player who, @NotNull @NotNull Entity clickedEntity)`
- `public PlayerInteractEntityEvent(@NotNull @NotNull Player who, @NotNull @NotNull Entity clickedEntity, @NotNull @NotNull EquipmentSlot hand)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull Entity getRightClicked()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
