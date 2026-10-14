---
title: "org.bukkit.event.player.PlayerRecipeDiscoverEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerRecipeDiscoverEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerRecipeDiscoverEvent**
`public class PlayerRecipeDiscoverEvent extends PlayerEvent implements Cancellable`
- `public PlayerRecipeDiscoverEvent(@NotNull Player who, @NotNull NamespacedKey recipe)`
- `@NotNull public NamespacedKey getRecipe()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
