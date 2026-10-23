---
title: "io.papermc.paper.event.player.PlayerStonecutterRecipeSelectEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerStonecutterRecipeSelectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerStonecutterRecipeSelectEvent(@NotNull @NotNull Player player, @NotNull @NotNull StonecutterInventory stonecutterInventory, @NotNull @NotNull StonecuttingRecipe stonecuttingRecipe)`
- `@NotNull public @NotNull StonecutterInventory getStonecutterInventory()`
- `@NotNull public @NotNull StonecuttingRecipe getStonecuttingRecipe()`
- `public void setStonecuttingRecipe(@NotNull @NotNull StonecuttingRecipe stonecuttingRecipe)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
