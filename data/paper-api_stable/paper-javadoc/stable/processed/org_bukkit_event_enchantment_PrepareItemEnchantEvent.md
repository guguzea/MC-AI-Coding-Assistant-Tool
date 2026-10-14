---
title: "org.bukkit.event.enchantment.PrepareItemEnchantEvent"
package: "org.bukkit.event.enchantment"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/enchantment/PrepareItemEnchantEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PrepareItemEnchantEvent**
`public class PrepareItemEnchantEvent extends InventoryEvent implements Cancellable`
- `@Internal public PrepareItemEnchantEvent(@NotNull @NotNull Player enchanter, @NotNull @NotNull EnchantmentView view, @NotNull @NotNull Block table, @NotNull @NotNull ItemStack item, @Nullable @Nullable EnchantmentOffer @NotNull [] offers, int bonus)`
- `@NotNull public @NotNull EnchantmentView getView()`
- `@NotNull public @NotNull Player getEnchanter()`
- `@NotNull public @NotNull Block getEnchantBlock()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull @Deprecated(since="1.20.5") public @NotNull int[] getExpLevelCostsOffered()`
- `@Nullable public @Nullable EnchantmentOffer @NotNull [] getOffers()`
- `public int getEnchantmentBonus()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
