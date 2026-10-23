---
title: "org.bukkit.event.block.BlockCookEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/block/BlockCookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public BlockCookEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result)`
- `@Internal public BlockCookEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack source, @NotNull @NotNull ItemStack result, @Nullable CookingRecipe<?> recipe)`
- `@NotNull public @NotNull ItemStack getSource()`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void setResult(@NotNull @NotNull ItemStack result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Nullable public CookingRecipe<?> getRecipe()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
