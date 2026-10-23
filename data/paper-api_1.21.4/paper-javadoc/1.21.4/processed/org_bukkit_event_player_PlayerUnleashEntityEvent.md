---
title: "org.bukkit.event.player.PlayerUnleashEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerUnleashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public PlayerUnleashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Player player, @NotNull @NotNull EquipmentSlot hand)`
- `@Internal public PlayerUnleashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Player player, @NotNull @NotNull EquipmentSlot hand, boolean dropLeash)`
- `@Deprecated(since="1.19.2", forRemoval=true) public PlayerUnleashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Player player)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
