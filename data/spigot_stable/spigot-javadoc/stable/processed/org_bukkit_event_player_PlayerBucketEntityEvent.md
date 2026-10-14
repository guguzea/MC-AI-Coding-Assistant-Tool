---
title: "org.bukkit.event.player.PlayerBucketEntityEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerBucketEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerBucketEntityEvent**
`public class PlayerBucketEntityEvent extends PlayerEvent implements Cancellable`
- `public PlayerBucketEntityEvent(@NotNull Player player, @NotNull Entity entity, @NotNull ItemStack originalBucket, @NotNull ItemStack entityBucket, @NotNull EquipmentSlot hand)`
- `@NotNull public Entity getEntity()`
- `@NotNull public ItemStack getOriginalBucket()`
- `@NotNull public ItemStack getEntityBucket()`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
