---
title: "org.bukkit.enchantments.EnchantmentWrapper"
package: "org.bukkit.enchantments"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/enchantments/EnchantmentWrapper.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EnchantmentWrapper(@NotNull @NotNull String name)`
- `@NotNull public @NotNull Enchantment getEnchantment()`
- `public int getMaxLevel()`
- `public int getStartLevel()`
- `@NotNull public @NotNull EnchantmentTarget getItemTarget()`
- `public boolean canEnchantItem(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull String getName()`
- `public boolean isTreasure()`
- `public boolean isCursed()`
- `public boolean conflictsWith(@NotNull @NotNull Enchantment other)`
- `@NotNull public Component displayName(int level)`
- `@NotNull public @NotNull String translationKey()`
- `public boolean isTradeable()`
- `public boolean isDiscoverable()`
- `@NotNull public EnchantmentRarity getRarity()`
- `public float getDamageIncrease(int level, @NotNull EntityCategory entityCategory)`
- `@NotNull public Set<EquipmentSlot> getActiveSlots()`
