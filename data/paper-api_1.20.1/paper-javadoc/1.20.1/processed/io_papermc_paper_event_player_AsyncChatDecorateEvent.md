---
title: "io.papermc.paper.event.player.AsyncChatDecorateEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/AsyncChatDecorateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Internal public AsyncChatDecorateEvent(boolean async, @Nullable @Nullable Player player, @NotNull @NotNull Component originalMessage, @NotNull @NotNull Component result)`
- `@Nullable public @Nullable Player player()`
- `@NotNull public @NotNull Component originalMessage()`
- `@NotNull public @NotNull Component result()`
- `public void result(@NotNull @NotNull Component result)`
- `@Deprecated(forRemoval=true) @ScheduledForRemoval(inVersion="1.21") @Contract(value="-> false", pure=true) public boolean isPreview()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
