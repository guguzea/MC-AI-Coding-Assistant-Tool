---
title: "org.bukkit.enchantments.EnchantmentWrapper"
package: "org.bukkit.enchantments"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/enchantments/EnchantmentWrapper.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EnchantmentWrapper&#8203;(@NotNull @NotNull String name)`
- `@NotNull public @NotNull Enchantment getEnchantment()`
- `public int getMaxLevel()`
- `public int getStartLevel()`
- `@NotNull public @NotNull EnchantmentTarget getItemTarget()`
- `public boolean canEnchantItem&#8203;(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull String getName()`
- `public boolean isTreasure()`
- `public boolean isCursed()`
- `public boolean conflictsWith&#8203;(@NotNull @NotNull Enchantment other)`
- `@NotNull public Component displayName&#8203;(int level)`
- `public boolean isTradeable()`
- `public boolean isDiscoverable()`
- `@NotNull public EnchantmentRarity getRarity()`
- `public float getDamageIncrease&#8203;(int level, @NotNull EntityCategory entityCategory)`
- `@NotNull public Set<EquipmentSlot> getActiveSlots()`
