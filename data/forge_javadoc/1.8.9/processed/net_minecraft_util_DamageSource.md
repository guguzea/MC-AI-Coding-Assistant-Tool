# DamageSource

## Class signature

```java
public class DamageSource extends java.lang.Object
```

## Constructors

- `public DamageSource(java.lang.String damageTypeIn)`

## Methods

- `public static DamageSource causeMobDamage( EntityLivingBase mob)`
- `public static DamageSource causePlayerDamage( EntityPlayer player)`
- `public static DamageSource causeArrowDamage( EntityArrow arrow, Entity p_76353_1_)`
- `public static DamageSource causeFireballDamage( EntityFireball fireball, Entity p_76362_1_)`
- `public static DamageSource causeThrownDamage( Entity p_76356_0_, Entity p_76356_1_)`
- `public static DamageSource causeIndirectMagicDamage( Entity p_76354_0_, Entity p_76354_1_)`
- `public static DamageSource causeThornsDamage( Entity p_92087_0_)`
- `public static DamageSource setExplosionSource( Explosion explosionIn)`
- `public boolean isProjectile()`
- `public DamageSource setProjectile()`
- `public boolean isExplosion()`
- `public DamageSource setExplosion()`
- `public boolean isUnblockable()`
- `public float getHungerDamage()`
- `public boolean canHarmInCreative()`
- `public boolean isDamageAbsolute()`
- `public Entity getSourceOfDamage()`
- `public Entity getEntity()`
- `public DamageSource setDamageBypassesArmor()`
- `public DamageSource setDamageAllowedInCreativeMode()`
- `public DamageSource setDamageIsAbsolute()`
- `public DamageSource setFireDamage()`
- `public IChatComponent getDeathMessage( EntityLivingBase p_151519_1_)`
- `public boolean isFireDamage()`
- `public java.lang.String getDamageType()`
- `public DamageSource setDifficultyScaled()`
- `public boolean isDifficultyScaled()`
- `public boolean isMagicDamage()`
- `public DamageSource setMagicDamage()`
- `public boolean isCreativePlayer()`

## Description

returns EntityDamageSourceIndirect of an arrow