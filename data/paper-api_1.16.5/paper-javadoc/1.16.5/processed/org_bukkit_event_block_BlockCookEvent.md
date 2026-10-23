---
title: "org.bukkit.event.block.BlockCookEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/BlockCookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public BlockCookEvent&#8203;(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result)`
- `public BlockCookEvent&#8203;(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result, @Nullable CookingRecipe<?> recipe)`
- `@NotNull public @NotNull ItemStack getSource()`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setResult&#8203;(@NotNull @NotNull ItemStack result)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@Nullable public CookingRecipe<?> getRecipe()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
