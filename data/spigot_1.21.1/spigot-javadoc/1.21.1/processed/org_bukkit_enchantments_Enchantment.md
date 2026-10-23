---
title: "org.bukkit.enchantments.Enchantment"
package: "org.bukkit.enchantments"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public abstract class org.bukkit.enchantments.Enchantment implements org.bukkit.Keyed,org.bukkit.Translatable`
- `public static final org.bukkit.enchantments.Enchantment PROTECTION`
- `public static final org.bukkit.enchantments.Enchantment FIRE_PROTECTION`
- `public static final org.bukkit.enchantments.Enchantment FEATHER_FALLING`
- `public static final org.bukkit.enchantments.Enchantment BLAST_PROTECTION`
- `public static final org.bukkit.enchantments.Enchantment PROJECTILE_PROTECTION`
- `public static final org.bukkit.enchantments.Enchantment RESPIRATION`
- `public static final org.bukkit.enchantments.Enchantment AQUA_AFFINITY`
- `public static final org.bukkit.enchantments.Enchantment THORNS`
- `public static final org.bukkit.enchantments.Enchantment DEPTH_STRIDER`
- `public static final org.bukkit.enchantments.Enchantment FROST_WALKER`
- `public static final org.bukkit.enchantments.Enchantment BINDING_CURSE`
- `public static final org.bukkit.enchantments.Enchantment SHARPNESS`
- `public static final org.bukkit.enchantments.Enchantment SMITE`
- `public static final org.bukkit.enchantments.Enchantment BANE_OF_ARTHROPODS`
- `public static final org.bukkit.enchantments.Enchantment KNOCKBACK`
- `public static final org.bukkit.enchantments.Enchantment FIRE_ASPECT`
- `public static final org.bukkit.enchantments.Enchantment LOOTING`
- `public static final org.bukkit.enchantments.Enchantment SWEEPING_EDGE`
- `public static final org.bukkit.enchantments.Enchantment EFFICIENCY`
- `public static final org.bukkit.enchantments.Enchantment SILK_TOUCH`
- `public static final org.bukkit.enchantments.Enchantment UNBREAKING`
- `public static final org.bukkit.enchantments.Enchantment FORTUNE`
- `public static final org.bukkit.enchantments.Enchantment POWER`
- `public static final org.bukkit.enchantments.Enchantment PUNCH`
- `public static final org.bukkit.enchantments.Enchantment FLAME`
- `public static final org.bukkit.enchantments.Enchantment INFINITY`
- `public static final org.bukkit.enchantments.Enchantment LUCK_OF_THE_SEA`
- `public static final org.bukkit.enchantments.Enchantment LURE`
- `public static final org.bukkit.enchantments.Enchantment LOYALTY`
- `public static final org.bukkit.enchantments.Enchantment IMPALING`
- `public static final org.bukkit.enchantments.Enchantment RIPTIDE`
- `public static final org.bukkit.enchantments.Enchantment CHANNELING`
- `public static final org.bukkit.enchantments.Enchantment MULTISHOT`
- `public static final org.bukkit.enchantments.Enchantment QUICK_CHARGE`
- `public static final org.bukkit.enchantments.Enchantment PIERCING`
- `public static final org.bukkit.enchantments.Enchantment DENSITY`
- `public static final org.bukkit.enchantments.Enchantment BREACH`
- `public static final org.bukkit.enchantments.Enchantment WIND_BURST`
- `public static final org.bukkit.enchantments.Enchantment MENDING`
- `public static final org.bukkit.enchantments.Enchantment VANISHING_CURSE`
- `public static final org.bukkit.enchantments.Enchantment SOUL_SPEED`
- `public static final org.bukkit.enchantments.Enchantment SWIFT_SNEAK`
- `public org.bukkit.enchantments.Enchantment()`
- `public abstract java.lang.String getName()`
- `public abstract int getMaxLevel()`
- `public abstract int getStartLevel()`
- `public abstract org.bukkit.enchantments.EnchantmentTarget getItemTarget()`
- `public abstract boolean isTreasure()`
- `public abstract boolean isCursed()`
- `public abstract boolean conflictsWith(org.bukkit.enchantments.Enchantment)`
- `public abstract boolean canEnchantItem(org.bukkit.inventory.ItemStack)`
- `public static org.bukkit.enchantments.Enchantment getByKey(org.bukkit.NamespacedKey)`
- `public static org.bukkit.enchantments.Enchantment getByName(java.lang.String)`
- `public static org.bukkit.enchantments.Enchantment[] values()`
