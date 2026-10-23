---
title: "org.bukkit.event.world.LootGenerateEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/world/LootGenerateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public LootGenerateEvent&#8203;(@NotNull @NotNull World world, @Nullable @Nullable Entity entity, @Nullable @Nullable InventoryHolder inventoryHolder, @NotNull @NotNull LootTable lootTable, @NotNull @NotNull LootContext lootContext, @NotNull @NotNull List<ItemStack> items, boolean plugin)`
- `@Nullable public @Nullable Entity getEntity()`
- `@Nullable public @Nullable InventoryHolder getInventoryHolder()`
- `@NotNull public @NotNull LootTable getLootTable()`
- `@NotNull public @NotNull LootContext getLootContext()`
- `public void setLoot&#8203;(@Nullable @Nullable Collection<ItemStack> loot)`
- `@NotNull public @NotNull List<ItemStack> getLoot()`
- `public boolean isPlugin()`
- `public void setCancelled&#8203;(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
