---
title: "org.bukkit.event.player.PlayerBucketEmptyEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerBucketEmptyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerBucketEmptyEvent**
`public class PlayerBucketEmptyEvent extends PlayerBucketEvent`
- `@Deprecated(since="1.14.4") public PlayerBucketEmptyEvent(@NotNull Player who, @NotNull Block blockClicked, @NotNull BlockFace blockFace, @NotNull Material bucket, @NotNull ItemStack itemInHand)`
- `@Deprecated(since="1.19.2") public PlayerBucketEmptyEvent(@NotNull Player who, @NotNull Block block, @NotNull Block blockClicked, @NotNull BlockFace blockFace, @NotNull Material bucket, @NotNull ItemStack itemInHand)`
- `public PlayerBucketEmptyEvent(@NotNull Player who, @NotNull Block block, @NotNull Block blockClicked, @NotNull BlockFace blockFace, @NotNull Material bucket, @NotNull ItemStack itemInHand, @NotNull EquipmentSlot hand)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
