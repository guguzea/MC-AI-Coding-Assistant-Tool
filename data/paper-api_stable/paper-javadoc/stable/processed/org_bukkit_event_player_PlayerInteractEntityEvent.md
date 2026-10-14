---
title: "org.bukkit.event.player.PlayerInteractEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerInteractEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerInteractEntityEvent**
`@Obsolete public class PlayerInteractEntityEvent extends PlayerEvent implements Cancellable`
- `protected Entity clickedEntity`
- `@Internal public PlayerInteractEntityEvent(@NotNull @NotNull Player player, @NotNull @NotNull Entity clickedEntity)`
- `@Internal public PlayerInteractEntityEvent(@NotNull @NotNull Player player, @NotNull @NotNull Entity clickedEntity, @NotNull @NotNull EquipmentSlot hand)`
- `@NotNull public @NotNull Entity getRightClicked()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
