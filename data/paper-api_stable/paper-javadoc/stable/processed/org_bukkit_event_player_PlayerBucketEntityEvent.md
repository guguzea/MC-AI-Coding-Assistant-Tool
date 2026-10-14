---
title: "org.bukkit.event.player.PlayerBucketEntityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerBucketEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerBucketEntityEvent**
`public class PlayerBucketEntityEvent extends PlayerEvent implements Cancellable`
- `protected final Entity entity`
- `@Internal public PlayerBucketEntityEvent(@NotNull @NotNull Player player, @NotNull @NotNull Entity entity, @NotNull @NotNull ItemStack originalBucket, @NotNull @NotNull ItemStack entityBucket, @NotNull @NotNull EquipmentSlot hand)`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public @NotNull ItemStack getOriginalBucket()`
- `@NotNull public @NotNull ItemStack getEntityBucket()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
