---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerBucketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerBucketEvent(@NotNull @NotNull Player who, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `@Deprecated public PlayerBucketEvent(@NotNull @NotNull Player who, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand)`
- `public PlayerBucketEvent(@NotNull @NotNull Player who, @NotNull @NotNull Block block, @NotNull @NotNull Block blockClicked, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull Material bucket, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull EquipmentSlot hand)`
- `@NotNull public @NotNull Material getBucket()`
- `@Nullable public @Nullable ItemStack getItemStack()`
- `public void setItemStack(@Nullable @Nullable ItemStack itemStack)`
- `@NotNull public final @NotNull Block getBlock()`
- `@NotNull public @NotNull Block getBlockClicked()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
