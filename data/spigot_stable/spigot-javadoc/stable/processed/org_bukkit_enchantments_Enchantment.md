---
title: "org.bukkit.enchantments.Enchantment"
package: "org.bukkit.enchantments"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/enchantments/Enchantment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Enchantment**
`public abstract class Enchantment extends Object implements Keyed, Translatable, RegistryAware`
- `public static final Enchantment PROTECTION`
- `public static final Enchantment FIRE_PROTECTION`
- `public static final Enchantment FEATHER_FALLING`
- `public static final Enchantment BLAST_PROTECTION`
- `public static final Enchantment PROJECTILE_PROTECTION`
- `public static final Enchantment RESPIRATION`
- `public static final Enchantment AQUA_AFFINITY`
- `public static final Enchantment THORNS`
- `public static final Enchantment DEPTH_STRIDER`
- `public static final Enchantment FROST_WALKER`
- `public static final Enchantment BINDING_CURSE`
- `public static final Enchantment SHARPNESS`
- `public static final Enchantment SMITE`
- `public static final Enchantment BANE_OF_ARTHROPODS`
- `public static final Enchantment KNOCKBACK`
- `public static final Enchantment FIRE_ASPECT`
- `public static final Enchantment LOOTING`
- `public static final Enchantment SWEEPING_EDGE`
- `public static final Enchantment EFFICIENCY`
- `public static final Enchantment SILK_TOUCH`
- `public static final Enchantment UNBREAKING`
- `public static final Enchantment FORTUNE`
- `public static final Enchantment POWER`
- `public static final Enchantment PUNCH`
- `public static final Enchantment FLAME`
- `public static final Enchantment INFINITY`
- `public static final Enchantment LUCK_OF_THE_SEA`
- `public static final Enchantment LURE`
- `public static final Enchantment LOYALTY`
- `public static final Enchantment IMPALING`
- `public static final Enchantment RIPTIDE`
- `public static final Enchantment CHANNELING`
- `public static final Enchantment MULTISHOT`
- `public static final Enchantment QUICK_CHARGE`
- `public static final Enchantment PIERCING`
- `public static final Enchantment DENSITY`
- `public static final Enchantment BREACH`
- `public static final Enchantment WIND_BURST`
- `public static final Enchantment LUNGE`
- `public static final Enchantment MENDING`
- `public static final Enchantment VANISHING_CURSE`
- `public static final Enchantment SOUL_SPEED`
- `public static final Enchantment SWIFT_SNEAK`
- `public Enchantment()`
- `@NotNull @Deprecated(since="1.13") public abstract String getName()`
- `public abstract int getMaxLevel()`
- `public abstract int getStartLevel()`
- `@NotNull @Deprecated(since="1.20.5") public abstract EnchantmentTarget getItemTarget()`
- `@Deprecated(since="1.21") public abstract boolean isTreasure()`
- `@Deprecated(since="1.13") public abstract boolean isCursed()`
- `public abstract boolean conflictsWith(@NotNull Enchantment other)`
- `public abstract boolean canEnchantItem(@NotNull ItemStack item)`
- `@NotNull @Deprecated(since="1.21.4") public abstract NamespacedKey getKey()`
- `@Contract("null -> null") @Nullable @Deprecated(since="1.20.3") public static Enchantment getByKey(@Nullable NamespacedKey key)`
- `@Deprecated(since="1.13") @Contract("null -> null") @Nullable public static Enchantment getByName(@Nullable String name)`
- `@NotNull @Deprecated(since="1.20.3") public static Enchantment[] values()`
