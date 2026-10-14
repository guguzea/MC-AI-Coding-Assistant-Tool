---
title: "org.bukkit.event.enchantment.EnchantItemEvent"
package: "org.bukkit.event.enchantment"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/enchantment/EnchantItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EnchantItemEvent**
`public class EnchantItemEvent extends InventoryEvent implements Cancellable`
- `@Internal public EnchantItemEvent(@NotNull @NotNull Player enchanter, @NotNull @NotNull InventoryView view, @NotNull @NotNull Block table, @NotNull @NotNull ItemStack item, int level, @NotNull @NotNull Map<Enchantment, Integer> enchants, @NotNull @NotNull Enchantment enchantmentHint, int levelHint, int button)`
- `@NotNull public @NotNull Player getEnchanter()`
- `@NotNull public @NotNull Block getEnchantBlock()`
- `@NotNull public @NotNull ItemStack getItem()`
- `public void setItem(@NotNull @NotNull ItemStack item)`
- `public int getExpLevelCost()`
- `public void setExpLevelCost(int level)`
- `@NotNull public @NotNull Map<Enchantment, Integer> getEnchantsToAdd()`
- `@NotNull public @NotNull Enchantment getEnchantmentHint()`
- `public int getLevelHint()`
- `public int whichButton()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
