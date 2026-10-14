---
title: "org.bukkit.event.player.PlayerUnleashEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerUnleashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerUnleashEntityEvent**
`public class PlayerUnleashEntityEvent extends EntityUnleashEvent implements Cancellable`
- `@Internal public PlayerUnleashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Player player, @NotNull @NotNull EquipmentSlot hand, boolean dropLeash)`
- `@Internal @Deprecated(forRemoval=true) public PlayerUnleashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Player player, @NotNull @NotNull EquipmentSlot hand)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public PlayerUnleashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Player player)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
