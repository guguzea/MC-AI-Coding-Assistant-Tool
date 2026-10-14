---
title: "org.bukkit.event.player.PlayerQuitEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerQuitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerQuitEvent**
`public class PlayerQuitEvent extends PlayerEvent`
- `@Internal @Deprecated(forRemoval=true) public PlayerQuitEvent(@NotNull @NotNull Player player, @Nullable @Nullable String quitMessage)`
- `@Internal @Deprecated(forRemoval=true) public PlayerQuitEvent(@NotNull @NotNull Player player, @Nullable @Nullable String quitMessage, @Nullable @Nullable PlayerQuitEvent.QuitReason quitReason)`
- `@Internal @Deprecated(forRemoval=true) public PlayerQuitEvent(@NotNull @NotNull Player player, @Nullable @Nullable Component quitMessage)`
- `@Internal public PlayerQuitEvent(@NotNull @NotNull Player player, @Nullable @Nullable Component quitMessage, @Nullable @Nullable PlayerQuitEvent.QuitReason quitReason)`
- `@Nullable public @Nullable Component quitMessage()`
- `public void quitMessage(@Nullable @Nullable Component quitMessage)`
- `@Nullable @Deprecated public @Nullable String getQuitMessage()`
- `@Deprecated public void setQuitMessage(@Nullable @Nullable String quitMessage)`
- `@NotNull public @NotNull PlayerQuitEvent.QuitReason getReason()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
