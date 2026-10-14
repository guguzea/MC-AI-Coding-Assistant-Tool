---
title: "org.bukkit.event.player.PlayerRecipeDiscoverEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerRecipeDiscoverEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerRecipeDiscoverEvent**
`@NullMarked public class PlayerRecipeDiscoverEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerRecipeDiscoverEvent(Player player, NamespacedKey recipe, boolean showNotification)`
- `public NamespacedKey getRecipe()`
- `public boolean shouldShowNotification()`
- `public void shouldShowNotification(boolean showNotification)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
