---
title: "org.bukkit.enchantments.EnchantmentWrapper"
package: "org.bukkit.enchantments"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/enchantments/EnchantmentWrapper.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `protected EnchantmentWrapper()`
- `@NotNull public @NotNull Enchantment getEnchantment()`
- `@NotNull public Component displayName(int level)`
- `@NotNull public @NotNull String translationKey()`
- `public boolean isTradeable()`
- `public boolean isDiscoverable()`
- `public int getMinModifiedCost(int level)`
- `public int getMaxModifiedCost(int level)`
- `@NotNull public EnchantmentRarity getRarity()`
- `public float getDamageIncrease(int level, @NotNull EntityCategory entityCategory)`
- `@NotNull public Set<EquipmentSlot> getActiveSlots()`
