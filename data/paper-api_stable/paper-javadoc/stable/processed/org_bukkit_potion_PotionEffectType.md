---
title: "org.bukkit.potion.PotionEffectType"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/26.3/org/bukkit/potion/PotionEffectType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PotionEffectType**
`public abstract class PotionEffectType extends Object implements Keyed, Translatable, Translatable, FeatureDependant`
- `public static final PotionEffectType SPEED`
- `public static final PotionEffectType SLOWNESS`
- `public static final PotionEffectType HASTE`
- `public static final PotionEffectType MINING_FATIGUE`
- `public static final PotionEffectType STRENGTH`
- `public static final PotionEffectType INSTANT_HEALTH`
- `public static final PotionEffectType INSTANT_DAMAGE`
- `public static final PotionEffectType JUMP_BOOST`
- `public static final PotionEffectType NAUSEA`
- `public static final PotionEffectType REGENERATION`
- `public static final PotionEffectType RESISTANCE`
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
- `public static final PotionEffectType TRIAL_OMEN`
- `public static final PotionEffectType RAID_OMEN`
- `public static final PotionEffectType WIND_CHARGED`
- `public static final PotionEffectType WEAVING`
- `public static final PotionEffectType OOZING`
- `public static final PotionEffectType INFESTED`
- `public static final PotionEffectType BREATH_OF_THE_NAUTILUS`
- `public PotionEffectType()`
- `@NotNull public abstract @NotNull PotionEffect createEffect(int duration, int amplifier)`
- `public abstract boolean isInstant()`
- `@NotNull @Deprecated(since="26.3") public abstract @NotNull PotionEffectTypeCategory getCategory()`
- `@NotNull public abstract @NotNull Color getColor()`
- `@Deprecated(since="1.14", forRemoval=true) public abstract double getDurationModifier()`
- `@Deprecated(since="1.6.2", forRemoval=true) public abstract int getId()`
- `@NotNull @Deprecated(since="1.20.3") public abstract @NotNull String getName()`
- `@Contract("null -> null") @Nullable @Deprecated(since="1.20.3") public static @Nullable PotionEffectType getByKey(@Nullable @Nullable NamespacedKey key)`
- `@Internal @Nullable public static @Nullable PotionEffectType getById(int id)`
- `@Nullable @Deprecated(since="1.20.3") public static @Nullable PotionEffectType getByName(@NotNull @NotNull String name)`
- `@NotNull @Deprecated(since="1.20.3") public static @NotNull PotionEffectType[] values()`
- `@NotNull public abstract Map<Attribute, AttributeModifier> getEffectAttributes()`
- `public abstract double getAttributeModifierAmount(@NotNull Attribute attribute, int effectAmplifier)`
- `@NotNull public abstract PotionEffectType.Category getEffectCategory()`
