---
title: "io.papermc.paper.event.player.ChatEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/player/ChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public ChatEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull Set<Audience> viewers, @NotNull @NotNull ChatRenderer renderer, @NotNull @NotNull Component message, @NotNull @NotNull Component originalMessage)`
- `@Deprecated public ChatEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull Set<Audience> viewers, @NotNull @NotNull ChatRenderer renderer, @NotNull @NotNull Component message)`
- `@Deprecated public ChatEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull Set<Player> recipients, @NotNull @NotNull Set<Audience> viewers, @NotNull @NotNull ChatRenderer renderer, @NotNull @NotNull Component message, @NotNull @NotNull Component originalMessage)`
- `@Deprecated public ChatEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull Set<Player> recipients, @NotNull @NotNull ChatComposer composer, @NotNull @NotNull Component message)`
- `@Deprecated public ChatEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull Set<Player> recipients, @NotNull @NotNull ChatFormatter formatter, @NotNull @NotNull Component message)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
