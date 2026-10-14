---
title: "org.bukkit.damage.DamageType"
package: "org.bukkit.damage"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/damage/DamageType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface DamageType**
`public interface DamageType extends Keyed, Translatable, RegistryAware`
- `static final DamageType IN_FIRE`
- `static final DamageType CAMPFIRE`
- `static final DamageType LIGHTNING_BOLT`
- `static final DamageType ON_FIRE`
- `static final DamageType LAVA`
- `static final DamageType HOT_FLOOR`
- `static final DamageType SULFUR_CUBE_HOT`
- `static final DamageType IN_WALL`
- `static final DamageType CRAMMING`
- `static final DamageType DROWN`
- `static final DamageType STARVE`
- `static final DamageType CACTUS`
- `static final DamageType FALL`
- `static final DamageType ENDER_PEARL`
- `static final DamageType FLY_INTO_WALL`
- `static final DamageType OUT_OF_WORLD`
- `static final DamageType GENERIC`
- `static final DamageType MAGIC`
- `static final DamageType WITHER`
- `static final DamageType DRAGON_BREATH`
- `static final DamageType DRY_OUT`
- `static final DamageType SWEET_BERRY_BUSH`
- `static final DamageType FREEZE`
- `static final DamageType STALAGMITE`
- `static final DamageType FALLING_BLOCK`
- `static final DamageType FALLING_ANVIL`
- `static final DamageType FALLING_STALACTITE`
- `static final DamageType STING`
- `static final DamageType MOB_ATTACK`
- `static final DamageType MOB_ATTACK_NO_AGGRO`
- `static final DamageType PLAYER_ATTACK`
- `static final DamageType SPEAR`
- `static final DamageType ARROW`
- `static final DamageType TRIDENT`
- `static final DamageType MOB_PROJECTILE`
- `static final DamageType SPIT`
- `static final DamageType FIREWORKS`
- `static final DamageType FIREBALL`
- `static final DamageType UNATTRIBUTED_FIREBALL`
- `static final DamageType WITHER_SKULL`
- `static final DamageType THROWN`
- `static final DamageType INDIRECT_MAGIC`
- `static final DamageType THORNS`
- `static final DamageType EXPLOSION`
- `static final DamageType PLAYER_EXPLOSION`
- `static final DamageType SONIC_BOOM`
- `static final DamageType BAD_RESPAWN_POINT`
- `static final DamageType OUTSIDE_BORDER`
- `static final DamageType GENERIC_KILL`
- `static final DamageType WIND_CHARGE`
- `static final DamageType MACE_SMASH`
- `@NotNull String getTranslationKey()`
- `@NotNull DamageScaling getDamageScaling()`
- `@NotNull DamageEffect getDamageEffect()`
- `@NotNull DeathMessageType getDeathMessageType()`
- `float getExhaustion()`
- `@NotNull @Deprecated(since="1.21.4") NamespacedKey getKey()`
