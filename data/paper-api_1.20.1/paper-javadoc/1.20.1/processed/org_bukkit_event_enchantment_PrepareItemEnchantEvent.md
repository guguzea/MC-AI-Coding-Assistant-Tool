---
title: "org.bukkit.event.enchantment.PrepareItemEnchantEvent"
package: "org.bukkit.event.enchantment"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/enchantment/PrepareItemEnchantEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PrepareItemEnchantEvent(@NotNull @NotNull Player enchanter, @NotNull @NotNull InventoryView view, @NotNull @NotNull Block table, @NotNull @NotNull ItemStack item, @Nullable @Nullable EnchantmentOffer @NotNull [] offers, int bonus)`
- `@NotNull public @NotNull Player getEnchanter()`
- `@NotNull public @NotNull Block getEnchantBlock()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@Deprecated @NotNull public @org.jetbrains.annotations.NotNull int[] getExpLevelCostsOffered()`
- `@Nullable public @Nullable EnchantmentOffer @NotNull [] getOffers()`
- `public int getEnchantmentBonus()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
