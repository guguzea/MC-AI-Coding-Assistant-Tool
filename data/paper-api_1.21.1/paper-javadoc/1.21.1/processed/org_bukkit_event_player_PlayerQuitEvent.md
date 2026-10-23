---
title: "org.bukkit.event.player.PlayerQuitEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerQuitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerQuitEvent(@NotNull @NotNull Player who, @Nullable @Nullable String quitMessage)`
- `@Deprecated public PlayerQuitEvent(@NotNull @NotNull Player who, @Nullable @Nullable String quitMessage, @Nullable @Nullable PlayerQuitEvent.QuitReason quitReason)`
- `@Deprecated public PlayerQuitEvent(@NotNull @NotNull Player who, @Nullable Component quitMessage)`
- `public PlayerQuitEvent(@NotNull @NotNull Player who, @Nullable Component quitMessage, @Nullable @Nullable PlayerQuitEvent.QuitReason quitReason)`
- `public @Nullable Component quitMessage()`
- `public void quitMessage(@Nullable Component quitMessage)`
- `@Nullable @Deprecated public @Nullable String getQuitMessage()`
- `@Deprecated public void setQuitMessage(@Nullable @Nullable String quitMessage)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull PlayerQuitEvent.QuitReason getReason()`
