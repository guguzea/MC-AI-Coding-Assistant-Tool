---
title: "org.bukkit.event.block.CrafterCraftEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/CrafterCraftEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class CrafterCraftEvent**
`public class CrafterCraftEvent extends BlockEvent implements Cancellable`
- `@Deprecated(since="1.21.4") public CrafterCraftEvent(@NotNull Block theBlock, @NotNull CraftingRecipe recipe, @NotNull ItemStack result)`
- `public CrafterCraftEvent(@NotNull Block theBlock, @NotNull CraftingRecipe recipe, @NotNull ItemStack result, @NotNull List<ItemStack> remainingItems)`
- `@NotNull public ItemStack getResult()`
- `public void setResult(@NotNull ItemStack result)`
- `@NotNull public List<ItemStack> getRemainingItems()`
- `@NotNull public CraftingRecipe getRecipe()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
