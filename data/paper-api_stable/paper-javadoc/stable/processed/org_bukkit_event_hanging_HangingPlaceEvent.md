---
title: "org.bukkit.event.hanging.HangingPlaceEvent"
package: "org.bukkit.event.hanging"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/hanging/HangingPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class HangingPlaceEvent**
`public class HangingPlaceEvent extends HangingEvent implements Cancellable`
- `@Internal @Deprecated(since="1.17.1") public HangingPlaceEvent(@NotNull @NotNull Hanging hanging, @Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace, @Nullable @Nullable EquipmentSlot hand)`
- `@Internal public HangingPlaceEvent(@NotNull @NotNull Hanging hanging, @Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace, @Nullable @Nullable EquipmentSlot hand, @Nullable @Nullable ItemStack itemStack)`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull Block getBlock()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@Nullable public @Nullable ItemStack getItemStack()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
