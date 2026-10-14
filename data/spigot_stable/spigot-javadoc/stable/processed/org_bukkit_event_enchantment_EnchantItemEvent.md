---
title: "org.bukkit.event.enchantment.EnchantItemEvent"
package: "org.bukkit.event.enchantment"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/enchantment/EnchantItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EnchantItemEvent**
`public class EnchantItemEvent extends InventoryEvent implements Cancellable`
- `public EnchantItemEvent(@NotNull Player enchanter, @NotNull InventoryView view, @NotNull Block table, @NotNull ItemStack item, int level, @NotNull Map<Enchantment, Integer> enchants, @NotNull Enchantment enchantmentHint, int levelHint, int i)`
- `@NotNull public Player getEnchanter()`
- `@NotNull public Block getEnchantBlock()`
- `@NotNull public ItemStack getItem()`
- `public int getExpLevelCost()`
- `public void setExpLevelCost(int level)`
- `@NotNull public Map<Enchantment, Integer> getEnchantsToAdd()`
- `@NotNull public Enchantment getEnchantmentHint()`
- `public int getLevelHint()`
- `public int whichButton()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
