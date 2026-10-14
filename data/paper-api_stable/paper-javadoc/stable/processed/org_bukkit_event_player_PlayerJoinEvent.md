---
title: "org.bukkit.event.player.PlayerJoinEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerJoinEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerJoinEvent**
`public class PlayerJoinEvent extends PlayerEvent`
- `@Internal public PlayerJoinEvent(@NotNull @NotNull Player playerJoined, @Nullable @Nullable Component joinMessage)`
- `@Internal @Deprecated(forRemoval=true) public PlayerJoinEvent(@NotNull @NotNull Player playerJoined, @Nullable @Nullable String joinMessage)`
- `@Nullable public @Nullable Component joinMessage()`
- `public void joinMessage(@Nullable @Nullable Component joinMessage)`
- `@Nullable @Deprecated public @Nullable String getJoinMessage()`
- `@Deprecated public void setJoinMessage(@Nullable @Nullable String joinMessage)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
