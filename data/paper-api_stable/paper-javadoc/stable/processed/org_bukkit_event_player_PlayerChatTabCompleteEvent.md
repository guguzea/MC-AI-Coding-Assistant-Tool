---
title: "org.bukkit.event.player.PlayerChatTabCompleteEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerChatTabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerChatTabCompleteEvent**
`@Deprecated(since="1.13") public class PlayerChatTabCompleteEvent extends PlayerEvent`
- `@Internal public PlayerChatTabCompleteEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message, @NotNull @NotNull Collection<String> completions)`
- `@NotNull public @NotNull String getChatMessage()`
- `@NotNull public @NotNull String getLastToken()`
- `@NotNull public @NotNull Collection<String> getTabCompletions()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
