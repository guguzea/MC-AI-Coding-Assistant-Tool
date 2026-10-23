---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerBucketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerBucketEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `public PlayerBucketEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `@Deprecated public PlayerBucketEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand, @Nullable @Nullable EquipmentSlot hand)`
- `public PlayerBucketEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand, @Nullable @Nullable EquipmentSlot hand)`
- `@NotNull public @NotNull Material getBucket()`
- `@Nullable public @Nullable ItemStack getItemStack()`
- `public void setItemStack&#8203;(@Nullable @Nullable ItemStack itemStack)`
- `@NotNull public final @NotNull Block getBlock()`
- `@NotNull public @NotNull Block getBlockClicked()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
