---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerBucketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerBucketEvent**
`public abstract class PlayerBucketEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(since="1.14.4", forRemoval=true) public PlayerBucketEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public PlayerBucketEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `@Internal public PlayerBucketEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull EquipmentSlot hand)`
- `@NotNull public final @NotNull Block getBlock()`
- `@NotNull public @NotNull Block getBlockClicked()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@NotNull public @NotNull Material getBucket()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@Nullable public @Nullable ItemStack getItemStack()`
- `public void setItemStack(@Nullable @Nullable ItemStack itemStack)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
