---
title: "org.bukkit.event.enchantment.EnchantItemEvent"
package: "org.bukkit.event.enchantment"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/enchantment/EnchantItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EnchantItemEvent&#8203;(@NotNull @NotNull Player enchanter, @NotNull @NotNull InventoryView view, @NotNull @NotNull Block table, @NotNull @NotNull ItemStack item, int level, @NotNull @NotNull Map<Enchantment,&#8203;Integer> enchants, int i)`
- `@NotNull public @NotNull Player getEnchanter()`
- `@NotNull public @NotNull Block getEnchantBlock()`
- `@NotNull public @NotNull ItemStack getItem()`
- `public int getExpLevelCost()`
- `public void setExpLevelCost&#8203;(int level)`
- `@NotNull public @NotNull Map<Enchantment,&#8203;Integer> getEnchantsToAdd()`
- `public int whichButton()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
