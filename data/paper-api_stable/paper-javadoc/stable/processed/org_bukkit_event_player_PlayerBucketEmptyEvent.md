---
title: "org.bukkit.event.player.PlayerBucketEmptyEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerBucketEmptyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerBucketEmptyEvent**
`public class PlayerBucketEmptyEvent extends PlayerBucketEvent`
- `@Internal @Deprecated(since="1.14.4", forRemoval=true) public PlayerBucketEmptyEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public PlayerBucketEmptyEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `@Internal public PlayerBucketEmptyEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull EquipmentSlot hand)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
