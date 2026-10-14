---
title: "org.bukkit.event.world.LootGenerateEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/LootGenerateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class LootGenerateEvent**
`public class LootGenerateEvent extends WorldEvent implements Cancellable`
- `@Internal public LootGenerateEvent(@NotNull @NotNull World world, @Nullable @Nullable Entity entity, @Nullable @Nullable InventoryHolder inventoryHolder, @NotNull @NotNull LootTable lootTable, @NotNull @NotNull LootContext lootContext, @NotNull @NotNull List<ItemStack> items, boolean plugin)`
- `@Nullable public @Nullable Entity getEntity()`
- `@Nullable public @Nullable InventoryHolder getInventoryHolder()`
- `@NotNull public @NotNull LootTable getLootTable()`
- `@NotNull public @NotNull LootContext getLootContext()`
- `public void setLoot(@Nullable @Nullable Collection<ItemStack> loot)`
- `@NotNull public @NotNull List<ItemStack> getLoot()`
- `public boolean isPlugin()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
