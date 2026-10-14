---
title: "org.bukkit.damage.DamageType"
package: "org.bukkit.damage"
source: https://jd.papermc.io/paper/26.3/org/bukkit/damage/DamageType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DamageType**
`public interface DamageType extends Keyed, Translatable`
- `static final DamageType ARROW`
- `static final DamageType BAD_RESPAWN_POINT`
- `static final DamageType CACTUS`
- `static final DamageType CAMPFIRE`
- `static final DamageType CRAMMING`
- `static final DamageType DRAGON_BREATH`
- `static final DamageType DROWN`
- `static final DamageType DRY_OUT`
- `static final DamageType ENDER_PEARL`
- `static final DamageType EXPLOSION`
- `static final DamageType FALL`
- `static final DamageType FALLING_ANVIL`
- `static final DamageType FALLING_BLOCK`
- `static final DamageType FALLING_STALACTITE`
- `static final DamageType FIREBALL`
- `static final DamageType FIREWORKS`
- `static final DamageType FLY_INTO_WALL`
- `static final DamageType FREEZE`
- `static final DamageType GENERIC`
- `static final DamageType GENERIC_KILL`
- `static final DamageType HOT_FLOOR`
- `static final DamageType IN_FIRE`
- `static final DamageType IN_WALL`
- `static final DamageType INDIRECT_MAGIC`
- `static final DamageType LAVA`
- `static final DamageType LIGHTNING_BOLT`
- `static final DamageType MACE_SMASH`
- `static final DamageType MAGIC`
- `static final DamageType MOB_ATTACK`
- `static final DamageType MOB_ATTACK_NO_AGGRO`
- `static final DamageType MOB_PROJECTILE`
- `static final DamageType ON_FIRE`
- `static final DamageType OUT_OF_WORLD`
- `static final DamageType OUTSIDE_BORDER`
- `static final DamageType PLAYER_ATTACK`
- `static final DamageType PLAYER_EXPLOSION`
- `static final DamageType SONIC_BOOM`
- `static final DamageType SPEAR`
- `static final DamageType SPIT`
- `static final DamageType STALAGMITE`
- `static final DamageType STARVE`
- `static final DamageType STING`
- `static final DamageType SULFUR_CUBE_HOT`
- `static final DamageType SWEET_BERRY_BUSH`
- `static final DamageType THORNS`
- `static final DamageType THROWN`
- `static final DamageType TRIDENT`
- `static final DamageType UNATTRIBUTED_FIREBALL`
- `static final DamageType WIND_CHARGE`
- `static final DamageType WITHER`
- `static final DamageType WITHER_SKULL`
- `@NotNull @NotNull String getTranslationKey()`
- `@NotNull @NotNull DamageScaling getDamageScaling()`
- `@NotNull @NotNull DamageEffect getDamageEffect()`
- `@NotNull @NotNull DeathMessageType getDeathMessageType()`
- `float getExhaustion()`
