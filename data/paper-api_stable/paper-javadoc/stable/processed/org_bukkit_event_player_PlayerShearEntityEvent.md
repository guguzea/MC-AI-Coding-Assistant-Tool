---
title: "org.bukkit.event.player.PlayerShearEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerShearEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerShearEntityEvent**
`public class PlayerShearEntityEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerShearEntityEvent(@NotNull @NotNull Player player, @NotNull @NotNull Entity entity, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot hand, @NotNull @NotNull List<ItemStack> drops)`
- `@Internal @Deprecated(since="1.15.2", forRemoval=true) public PlayerShearEntityEvent(@NotNull @NotNull Player player, @NotNull @NotNull Entity entity)`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull @Unmodifiable List<ItemStack> getDrops()`
- `public void setDrops(@NotNull @NotNull List<ItemStack> drops)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
