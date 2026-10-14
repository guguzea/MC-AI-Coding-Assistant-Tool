---
title: "org.bukkit.event.player.PlayerUnleashEntityEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerUnleashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerUnleashEntityEvent**
`public class PlayerUnleashEntityEvent extends EntityUnleashEvent implements Cancellable`
- `public PlayerUnleashEntityEvent(@NotNull Entity entity, @NotNull Player player, @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2") public PlayerUnleashEntityEvent(@NotNull Entity entity, @NotNull Player player)`
- `@NotNull public Player getPlayer()`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
