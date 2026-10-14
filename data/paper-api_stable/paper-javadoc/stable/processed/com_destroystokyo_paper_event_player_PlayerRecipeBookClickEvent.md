---
title: "com.destroystokyo.paper.event.player.PlayerRecipeBookClickEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerRecipeBookClickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerRecipeBookClickEvent**
`@NullMarked public class PlayerRecipeBookClickEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerRecipeBookClickEvent(Player player, NamespacedKey recipe, boolean makeAll)`
- `public NamespacedKey getRecipe()`
- `public void setRecipe(NamespacedKey recipe)`
- `public boolean isMakeAll()`
- `public void setMakeAll(boolean makeAll)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
