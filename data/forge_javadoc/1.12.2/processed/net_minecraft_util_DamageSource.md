# DamageSource

**Inheritance:** java.lang.Object → net.minecraft.util.DamageSource

## Class signature

```java
public class DamageSource extends java.lang.Object
```

## Constructors

- `DamageSource(java.lang.String damageTypeIn)`

## Methods

- `boolean canHarmInCreative()`
- `static DamageSource causeArrowDamage(EntityArrow arrow, Entity indirectEntityIn)`
- `static DamageSource causeExplosionDamage(EntityLivingBase entityLivingBaseIn)`
- `static DamageSource causeExplosionDamage(Explosion explosionIn)`
- `static DamageSource causeFireballDamage(EntityFireball fireball, Entity indirectEntityIn)`
- `static DamageSource causeIndirectDamage(Entity source, EntityLivingBase indirectEntityIn)`
- `static DamageSource causeIndirectMagicDamage(Entity source, Entity indirectEntityIn)`
- `static DamageSource causeMobDamage(EntityLivingBase mob)`
- `static DamageSource causePlayerDamage(EntityPlayer player)`
- `static DamageSource causeThornsDamage(Entity source)`
- `static DamageSource causeThrownDamage(Entity source, Entity indirectEntityIn)`
- `Vec3d getDamageLocation()`
- `java.lang.String getDamageType()`
- `ITextComponent getDeathMessage(EntityLivingBase entityLivingBaseIn)`
- `float getHungerDamage()`
- `Entity getImmediateSource()`
- `Entity getTrueSource()`
- `boolean isCreativePlayer()`
- `boolean isDamageAbsolute()`
- `boolean isDifficultyScaled()`
- `boolean isExplosion()`
- `boolean isFireDamage()`
- `boolean isMagicDamage()`
- `boolean isProjectile()`
- `boolean isUnblockable()`
- `DamageSource setDamageAllowedInCreativeMode()`
- `DamageSource setDamageBypassesArmor()`
- `DamageSource setDamageIsAbsolute()`
- `DamageSource setDifficultyScaled()`
- `DamageSource setExplosion()`
- `DamageSource setFireDamage()`
- `DamageSource setMagicDamage()`
- `DamageSource setProjectile()`

## Fields

- `static DamageSource ANVIL`
- `static DamageSource CACTUS`
- `static DamageSource CRAMMING`
- `java.lang.String damageType`
- `static DamageSource DRAGON_BREATH`
- `static DamageSource DROWN`
- `static DamageSource FALL`
- `static DamageSource FALLING_BLOCK`
- `static DamageSource FIREWORKS`
- `static DamageSource FLY_INTO_WALL`
- `static DamageSource GENERIC`
- `static DamageSource HOT_FLOOR`
- `static DamageSource IN_FIRE`
- `static DamageSource IN_WALL`
- `static DamageSource LAVA`
- `static DamageSource LIGHTNING_BOLT`
- `static DamageSource MAGIC`
- `static DamageSource ON_FIRE`
- `static DamageSource OUT_OF_WORLD`
- `static DamageSource STARVE`
- `static DamageSource WITHER`