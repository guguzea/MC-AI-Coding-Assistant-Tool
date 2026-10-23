---
title: "org.bukkit.enchantments.Enchantment"
package: "org.bukkit.enchantments"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/enchantments/Enchantment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public static final Enchantment PROTECTION_ENVIRONMENTAL`
- `public static final Enchantment PROTECTION_FIRE`
- `public static final Enchantment PROTECTION_FALL`
- `public static final Enchantment PROTECTION_EXPLOSIONS`
- `public static final Enchantment PROTECTION_PROJECTILE`
- `public static final Enchantment OXYGEN`
- `public static final Enchantment WATER_WORKER`
- `public static final Enchantment THORNS`
- `public static final Enchantment DEPTH_STRIDER`
- `public static final Enchantment FROST_WALKER`
- `public static final Enchantment BINDING_CURSE`
- `public static final Enchantment DAMAGE_ALL`
- `public static final Enchantment DAMAGE_UNDEAD`
- `public static final Enchantment DAMAGE_ARTHROPODS`
- `public static final Enchantment KNOCKBACK`
- `public static final Enchantment FIRE_ASPECT`
- `public static final Enchantment LOOT_BONUS_MOBS`
- `public static final Enchantment SWEEPING_EDGE`
- `public static final Enchantment DIG_SPEED`
- `public static final Enchantment SILK_TOUCH`
- `public static final Enchantment DURABILITY`
- `public static final Enchantment LOOT_BONUS_BLOCKS`
- `public static final Enchantment ARROW_DAMAGE`
- `public static final Enchantment ARROW_KNOCKBACK`
- `public static final Enchantment ARROW_FIRE`
- `public static final Enchantment ARROW_INFINITE`
- `public static final Enchantment LUCK`
- `public static final Enchantment LURE`
- `public static final Enchantment LOYALTY`
- `public static final Enchantment IMPALING`
- `public static final Enchantment RIPTIDE`
- `public static final Enchantment CHANNELING`
- `public static final Enchantment MULTISHOT`
- `public static final Enchantment QUICK_CHARGE`
- `public static final Enchantment PIERCING`
- `public static final Enchantment MENDING`
- `public static final Enchantment VANISHING_CURSE`
- `public static final Enchantment SOUL_SPEED`
- `public static final Enchantment SWIFT_SNEAK`
- `public Enchantment(@NotNull @NotNull NamespacedKey key)`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull @Deprecated public abstract @NotNull String getName()`
- `public abstract int getMaxLevel()`
- `public abstract int getStartLevel()`
- `@NotNull public abstract @NotNull EnchantmentTarget getItemTarget()`
- `public abstract boolean isTreasure()`
- `public abstract boolean isCursed()`
- `public abstract boolean conflictsWith(@NotNull @NotNull Enchantment other)`
- `public abstract boolean canEnchantItem(@NotNull @NotNull ItemStack item)`
- `public abstract @NotNull Component displayName(int level)`
- `public abstract boolean isTradeable()`
- `public abstract boolean isDiscoverable()`
- `@NotNull public abstract EnchantmentRarity getRarity()`
- `public abstract float getDamageIncrease(int level, @NotNull EntityCategory entityCategory)`
- `@NotNull public abstract Set<EquipmentSlot> getActiveSlots()`
- `public boolean equals(Object obj)`
- `public int hashCode()`
- `public String toString()`
- `public static void registerEnchantment(@NotNull @NotNull Enchantment enchantment)`
- `public static boolean isAcceptingRegistrations()`
- `public static void stopAcceptingRegistrations()`
- `@Contract("null -> null") @Nullable public static @Nullable Enchantment getByKey(@Nullable @Nullable NamespacedKey key)`
- `@Deprecated @Contract("null -> null") @Nullable public static @Nullable Enchantment getByName(@Nullable @Nullable String name)`
- `@NotNull public static @NotNull Enchantment[] values()`
