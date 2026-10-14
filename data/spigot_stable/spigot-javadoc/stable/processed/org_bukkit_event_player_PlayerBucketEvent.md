---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerBucketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerBucketEvent**
`public abstract class PlayerBucketEvent extends PlayerEvent implements Cancellable`
- `@Deprecated(since="1.14.4") public PlayerBucketEvent(@NotNull Player who, @NotNull Block blockClicked, @NotNull BlockFace blockFace, @NotNull Material bucket, @NotNull ItemStack itemInHand)`
- `@Deprecated(since="1.19.2") public PlayerBucketEvent(@NotNull Player who, @NotNull Block block, @NotNull Block blockClicked, @NotNull BlockFace blockFace, @NotNull Material bucket, @NotNull ItemStack itemInHand)`
- `public PlayerBucketEvent(@NotNull Player who, @NotNull Block block, @NotNull Block blockClicked, @NotNull BlockFace blockFace, @NotNull Material bucket, @NotNull ItemStack itemInHand, @NotNull EquipmentSlot hand)`
- `@NotNull public Material getBucket()`
- `@Nullable public ItemStack getItemStack()`
- `public void setItemStack(@Nullable ItemStack itemStack)`
- `@NotNull public final Block getBlock()`
- `@NotNull public Block getBlockClicked()`
- `@NotNull public BlockFace getBlockFace()`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
