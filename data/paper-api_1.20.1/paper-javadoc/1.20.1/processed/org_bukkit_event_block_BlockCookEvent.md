---
title: "org.bukkit.event.block.BlockCookEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/block/BlockCookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public BlockCookEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result)`
- `public BlockCookEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result, @Nullable CookingRecipe<?> recipe)`
- `@NotNull public @NotNull ItemStack getSource()`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setResult(@NotNull @NotNull ItemStack result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Nullable public CookingRecipe<?> getRecipe()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
