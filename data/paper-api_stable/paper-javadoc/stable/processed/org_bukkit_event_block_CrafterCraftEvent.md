---
title: "org.bukkit.event.block.CrafterCraftEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/CrafterCraftEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class CrafterCraftEvent**
`public class CrafterCraftEvent extends BlockEvent implements Cancellable`
- `@Internal public CrafterCraftEvent(@NotNull @NotNull Block crafter, @NotNull @NotNull CraftingRecipe recipe, @NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setResult(@NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull CraftingRecipe getRecipe()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
