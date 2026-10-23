---
title: "io.papermc.paper.event.player.PlayerInventorySlotChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerInventorySlotChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerInventorySlotChangeEvent(@NotNull @NotNull Player player, int rawSlot, @NotNull @NotNull ItemStack oldItemStack, @NotNull @NotNull ItemStack newItemStack)`
- `public int getRawSlot()`
- `public int getSlot()`
- `@NotNull public @NotNull ItemStack getOldItemStack()`
- `@NotNull public @NotNull ItemStack getNewItemStack()`
- `public boolean shouldTriggerAdvancements()`
- `public void setShouldTriggerAdvancements(boolean triggerAdvancements)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
