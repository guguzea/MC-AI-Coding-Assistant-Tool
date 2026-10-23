---
title: "org.bukkit.enchantments.Enchantment"
package: "org.bukkit.enchantments"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public abstract class org.bukkit.enchantments.Enchantment`
- `public static final org.bukkit.enchantments.Enchantment PROTECTION_ENVIRONMENTAL`
- `public static final org.bukkit.enchantments.Enchantment PROTECTION_FIRE`
- `public static final org.bukkit.enchantments.Enchantment PROTECTION_FALL`
- `public static final org.bukkit.enchantments.Enchantment PROTECTION_EXPLOSIONS`
- `public static final org.bukkit.enchantments.Enchantment PROTECTION_PROJECTILE`
- `public static final org.bukkit.enchantments.Enchantment OXYGEN`
- `public static final org.bukkit.enchantments.Enchantment WATER_WORKER`
- `public static final org.bukkit.enchantments.Enchantment THORNS`
- `public static final org.bukkit.enchantments.Enchantment DEPTH_STRIDER`
- `public static final org.bukkit.enchantments.Enchantment FROST_WALKER`
- `public static final org.bukkit.enchantments.Enchantment BINDING_CURSE`
- `public static final org.bukkit.enchantments.Enchantment DAMAGE_ALL`
- `public static final org.bukkit.enchantments.Enchantment DAMAGE_UNDEAD`
- `public static final org.bukkit.enchantments.Enchantment DAMAGE_ARTHROPODS`
- `public static final org.bukkit.enchantments.Enchantment KNOCKBACK`
- `public static final org.bukkit.enchantments.Enchantment FIRE_ASPECT`
- `public static final org.bukkit.enchantments.Enchantment LOOT_BONUS_MOBS`
- `public static final org.bukkit.enchantments.Enchantment SWEEPING_EDGE`
- `public static final org.bukkit.enchantments.Enchantment DIG_SPEED`
- `public static final org.bukkit.enchantments.Enchantment SILK_TOUCH`
- `public static final org.bukkit.enchantments.Enchantment DURABILITY`
- `public static final org.bukkit.enchantments.Enchantment LOOT_BONUS_BLOCKS`
- `public static final org.bukkit.enchantments.Enchantment ARROW_DAMAGE`
- `public static final org.bukkit.enchantments.Enchantment ARROW_KNOCKBACK`
- `public static final org.bukkit.enchantments.Enchantment ARROW_FIRE`
- `public static final org.bukkit.enchantments.Enchantment ARROW_INFINITE`
- `public static final org.bukkit.enchantments.Enchantment LUCK`
- `public static final org.bukkit.enchantments.Enchantment LURE`
- `public static final org.bukkit.enchantments.Enchantment MENDING`
- `public static final org.bukkit.enchantments.Enchantment VANISHING_CURSE`
- `public org.bukkit.enchantments.Enchantment(int)`
- `public int getId()`
- `public abstract java.lang.String getName()`
- `public abstract int getMaxLevel()`
- `public abstract int getStartLevel()`
- `public abstract org.bukkit.enchantments.EnchantmentTarget getItemTarget()`
- `public abstract boolean isTreasure()`
- `public abstract boolean isCursed()`
- `public abstract boolean conflictsWith(org.bukkit.enchantments.Enchantment)`
- `public abstract boolean canEnchantItem(org.bukkit.inventory.ItemStack)`
- `public boolean equals(java.lang.Object)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public static void registerEnchantment(org.bukkit.enchantments.Enchantment)`
- `public static boolean isAcceptingRegistrations()`
- `public static void stopAcceptingRegistrations()`
- `public static org.bukkit.enchantments.Enchantment getById(int)`
- `public static org.bukkit.enchantments.Enchantment getByName(java.lang.String)`
- `public static org.bukkit.enchantments.Enchantment[] values()`
