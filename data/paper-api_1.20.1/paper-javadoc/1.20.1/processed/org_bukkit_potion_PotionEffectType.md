---
title: "org.bukkit.potion.PotionEffectType"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/potion/PotionEffectType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public static final PotionEffectType SPEED`
- `public static final PotionEffectType SLOW`
- `public static final PotionEffectType FAST_DIGGING`
- `public static final PotionEffectType SLOW_DIGGING`
- `public static final PotionEffectType INCREASE_DAMAGE`
- `public static final PotionEffectType HEAL`
- `public static final PotionEffectType HARM`
- `public static final PotionEffectType JUMP`
- `public static final PotionEffectType CONFUSION`
- `public static final PotionEffectType REGENERATION`
- `public static final PotionEffectType DAMAGE_RESISTANCE`
- `public static final PotionEffectType FIRE_RESISTANCE`
- `public static final PotionEffectType WATER_BREATHING`
- `public static final PotionEffectType INVISIBILITY`
- `public static final PotionEffectType BLINDNESS`
- `public static final PotionEffectType NIGHT_VISION`
- `public static final PotionEffectType HUNGER`
- `public static final PotionEffectType WEAKNESS`
- `public static final PotionEffectType POISON`
- `public static final PotionEffectType WITHER`
- `public static final PotionEffectType HEALTH_BOOST`
- `public static final PotionEffectType ABSORPTION`
- `public static final PotionEffectType SATURATION`
- `public static final PotionEffectType GLOWING`
- `public static final PotionEffectType LEVITATION`
- `public static final PotionEffectType LUCK`
- `public static final PotionEffectType UNLUCK`
- `public static final PotionEffectType SLOW_FALLING`
- `public static final PotionEffectType CONDUIT_POWER`
- `public static final PotionEffectType DOLPHINS_GRACE`
- `public static final PotionEffectType BAD_OMEN`
- `public static final PotionEffectType HERO_OF_THE_VILLAGE`
- `public static final PotionEffectType DARKNESS`
- `protected PotionEffectType(int id, @NotNull @NotNull NamespacedKey key)`
- `@NotNull public @NotNull PotionEffect createEffect(int duration, int amplifier)`
- `@Deprecated public abstract double getDurationModifier()`
- `@Deprecated public int getId()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public abstract @NotNull String getName()`
- `public abstract boolean isInstant()`
- `@NotNull public abstract @NotNull Color getColor()`
- `public boolean equals(Object obj)`
- `public int hashCode()`
- `public String toString()`
- `@Contract("null -> null") @Nullable public static @Nullable PotionEffectType getByKey(@Nullable @Nullable NamespacedKey key)`
- `@Deprecated @Nullable public static @Nullable PotionEffectType getById(int id)`
- `@Nullable public static @Nullable PotionEffectType getByName(@NotNull @NotNull String name)`
- `public static void registerPotionEffectType(@NotNull @NotNull PotionEffectType type)`
- `public static void stopAcceptingRegistrations()`
- `@NotNull public static @NotNull PotionEffectType[] values()`
- `@NotNull public abstract @NotNull Map<Attribute,AttributeModifier> getEffectAttributes()`
- `public abstract double getAttributeModifierAmount(@NotNull Attribute attribute, int effectAmplifier)`
- `@NotNull public abstract PotionEffectType.Category getEffectCategory()`
