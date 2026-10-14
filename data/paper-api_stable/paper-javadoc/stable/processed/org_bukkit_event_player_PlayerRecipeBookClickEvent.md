---
title: "org.bukkit.event.player.PlayerRecipeBookClickEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerRecipeBookClickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerRecipeBookClickEvent**
`@Deprecated(forRemoval=true) public class PlayerRecipeBookClickEvent extends PlayerEvent`
- `@Internal public PlayerRecipeBookClickEvent(@NotNull @NotNull Player player, @NotNull @NotNull Recipe recipe, boolean shiftClick)`
- `@NotNull public @NotNull Recipe getOriginalRecipe()`
- `@NotNull public @NotNull Recipe getRecipe()`
- `public void setRecipe(@NotNull @NotNull Recipe recipe)`
- `public boolean isShiftClick()`
- `public void setShiftClick(boolean shiftClick)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
