---
title: "org.bukkit.event.enchantment.PrepareItemEnchantEvent"
package: "org.bukkit.event.enchantment"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/enchantment/PrepareItemEnchantEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PrepareItemEnchantEvent**
`public class PrepareItemEnchantEvent extends InventoryEvent implements Cancellable`
- `public PrepareItemEnchantEvent(@NotNull Player enchanter, @NotNull EnchantmentView view, @NotNull Block table, @NotNull ItemStack item, @NotNull EnchantmentOffer[] offers, int bonus)`
- `@NotNull public Player getEnchanter()`
- `@NotNull public Block getEnchantBlock()`
- `@NotNull public ItemStack getItem()`
- `@NotNull @Deprecated(since="1.20.5") public int[] getExpLevelCostsOffered()`
- `@NotNull public EnchantmentOffer[] getOffers()`
- `public int getEnchantmentBonus()`
- `@NotNull public EnchantmentView getView()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
