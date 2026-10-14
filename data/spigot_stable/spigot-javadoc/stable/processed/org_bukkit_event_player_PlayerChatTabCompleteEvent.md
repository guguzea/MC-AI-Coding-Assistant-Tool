---
title: "org.bukkit.event.player.PlayerChatTabCompleteEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerChatTabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerChatTabCompleteEvent**
`@Deprecated(since="1.13") public class PlayerChatTabCompleteEvent extends PlayerEvent`
- `public PlayerChatTabCompleteEvent(@NotNull Player who, @NotNull String message, @NotNull Collection<String> completions)`
- `@NotNull public String getChatMessage()`
- `@NotNull public String getLastToken()`
- `@NotNull public Collection<String> getTabCompletions()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
