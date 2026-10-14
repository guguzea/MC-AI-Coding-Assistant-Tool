---
title: "org.bukkit.event.world.LootGenerateEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/LootGenerateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class LootGenerateEvent**
`public class LootGenerateEvent extends WorldEvent implements Cancellable`
- `public LootGenerateEvent(@NotNull World world, @Nullable Entity entity, @Nullable InventoryHolder inventoryHolder, @NotNull LootTable lootTable, @NotNull LootContext lootContext, @NotNull List<ItemStack> items, boolean plugin)`
- `@Nullable public Entity getEntity()`
- `@Nullable public InventoryHolder getInventoryHolder()`
- `@NotNull public LootTable getLootTable()`
- `@NotNull public LootContext getLootContext()`
- `public void setLoot(@Nullable Collection<ItemStack> loot)`
- `@NotNull public List<ItemStack> getLoot()`
- `public boolean isPlugin()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
