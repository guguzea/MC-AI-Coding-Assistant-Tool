---
title: "io.papermc.paper.event.player.PlayerItemFrameChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerItemFrameChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerItemFrameChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemFrame itemFrame, @NotNull @NotNull ItemStack itemStack, @NotNull @NotNull PlayerItemFrameChangeEvent.ItemFrameChangeAction action)`
- `@NotNull public @NotNull ItemFrame getItemFrame()`
- `@NotNull public @NotNull ItemStack getItemStack()`
- `public void setItemStack(@Nullable @Nullable ItemStack itemStack)`
- `@NotNull public @NotNull PlayerItemFrameChangeEvent.ItemFrameChangeAction getAction()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
