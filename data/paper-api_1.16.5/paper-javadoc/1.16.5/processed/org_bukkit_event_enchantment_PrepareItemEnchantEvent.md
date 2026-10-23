---
title: "org.bukkit.event.enchantment.PrepareItemEnchantEvent"
package: "org.bukkit.event.enchantment"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/enchantment/PrepareItemEnchantEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PrepareItemEnchantEvent&#8203;(@NotNull @NotNull Player enchanter, @NotNull @NotNull InventoryView view, @NotNull @NotNull Block table, @NotNull @NotNull ItemStack item, @NotNull @NotNull EnchantmentOffer[] offers, int bonus)`
- `@NotNull public @NotNull Player getEnchanter()`
- `@NotNull public @NotNull Block getEnchantBlock()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @org.jetbrains.annotations.NotNull int[] getExpLevelCostsOffered()`
- `@NotNull public @NotNull EnchantmentOffer[] getOffers()`
- `public int getEnchantmentBonus()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
