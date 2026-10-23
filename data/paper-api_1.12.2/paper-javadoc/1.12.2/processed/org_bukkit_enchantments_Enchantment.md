---
title: "org.bukkit.enchantments.Enchantment"
package: "org.bukkit.enchantments"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/enchantments/Enchantment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static Enchantment ARROW_DAMAGE`
- `static Enchantment ARROW_FIRE`
- `static Enchantment ARROW_INFINITE`
- `static Enchantment ARROW_KNOCKBACK`
- `static Enchantment BINDING_CURSE`
- `static Enchantment DAMAGE_ALL`
- `static Enchantment DAMAGE_ARTHROPODS`
- `static Enchantment DAMAGE_UNDEAD`
- `static Enchantment DEPTH_STRIDER`
- `static Enchantment DIG_SPEED`
- `static Enchantment DURABILITY`
- `static Enchantment FIRE_ASPECT`
- `static Enchantment FROST_WALKER`
- `static Enchantment KNOCKBACK`
- `static Enchantment LOOT_BONUS_BLOCKS`
- `static Enchantment LOOT_BONUS_MOBS`
- `static Enchantment LUCK`
- `static Enchantment LURE`
- `static Enchantment MENDING`
- `static Enchantment OXYGEN`
- `static Enchantment PROTECTION_ENVIRONMENTAL`
- `static Enchantment PROTECTION_EXPLOSIONS`
- `static Enchantment PROTECTION_FALL`
- `static Enchantment PROTECTION_FIRE`
- `static Enchantment PROTECTION_PROJECTILE`
- `static Enchantment SILK_TOUCH`
- `static Enchantment SWEEPING_EDGE`
- `static Enchantment THORNS`
- `static Enchantment VANISHING_CURSE`
- `static Enchantment WATER_WORKER`
- `abstract boolean canEnchantItem(ItemStack item)`
- `abstract boolean conflictsWith(Enchantment other)`
- `boolean equals(Object obj)`
- `static Enchantment getById(int id)`
- `static Enchantment getByName(String name)`
- `int getId()`
- `abstract EnchantmentTarget getItemTarget()`
- `abstract int getMaxLevel()`
- `abstract String getName()`
- `abstract int getStartLevel()`
- `int hashCode()`
- `static boolean isAcceptingRegistrations()`
- `abstract boolean isCursed()`
- `abstract boolean isTreasure()`
- `static void registerEnchantment(Enchantment enchantment)`
- `static void stopAcceptingRegistrations()`
- `String toString()`
- `static Enchantment[] values()`
