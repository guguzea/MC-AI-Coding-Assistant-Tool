---
title: "org.bukkit.event.block.BlockCookEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockCookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockCookEvent**
`public class BlockCookEvent extends BlockEvent implements Cancellable`
- `@Deprecated(forRemoval=true) @Internal public BlockCookEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result)`
- `@Internal public BlockCookEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result, @Nullable @Nullable CookingRecipe<?> recipe)`
- `@NotNull public @NotNull ItemStack getSource()`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setResult(@NotNull @NotNull ItemStack result)`
- `@Nullable public CookingRecipe<?> getRecipe()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
