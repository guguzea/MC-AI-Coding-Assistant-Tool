---
title: "org.bukkit.event.player.PlayerResourcePackStatusEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerResourcePackStatusEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerResourcePackStatusEvent**
`public class PlayerResourcePackStatusEvent extends PlayerEvent`
- `@Internal public PlayerResourcePackStatusEvent(@NotNull @NotNull Player player, @NotNull @NotNull UUID id, @NotNull @NotNull PlayerResourcePackStatusEvent.Status resourcePackStatus)`
- `@NotNull public @NotNull UUID getID()`
- `@NotNull public @NotNull PlayerResourcePackStatusEvent.Status getStatus()`
- `@Deprecated(forRemoval=true) @Contract("-> null") public String getHash()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
