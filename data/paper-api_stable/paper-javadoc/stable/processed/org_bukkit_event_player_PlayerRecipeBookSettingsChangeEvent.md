---
title: "org.bukkit.event.player.PlayerRecipeBookSettingsChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerRecipeBookSettingsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerRecipeBookSettingsChangeEvent**
`public class PlayerRecipeBookSettingsChangeEvent extends PlayerEvent`
- `@Internal public PlayerRecipeBookSettingsChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull PlayerRecipeBookSettingsChangeEvent.RecipeBookType recipeBookType, boolean open, boolean filtering)`
- `@NotNull public @NotNull PlayerRecipeBookSettingsChangeEvent.RecipeBookType getRecipeBookType()`
- `public boolean isOpen()`
- `public boolean isFiltering()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
