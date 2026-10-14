---
title: "org.bukkit.event.entity.PlayerLeashEntityEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/PlayerLeashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerLeashEntityEvent**
`public class PlayerLeashEntityEvent extends Event implements Cancellable`
- `@Internal public PlayerLeashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Entity leashHolder, @NotNull @NotNull Player leasher, @NotNull @NotNull EquipmentSlot hand)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public PlayerLeashEntityEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Entity leashHolder, @NotNull @NotNull Player leasher)`
- `@NotNull public @NotNull Entity getLeashHolder()`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public final @NotNull Player getPlayer()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
