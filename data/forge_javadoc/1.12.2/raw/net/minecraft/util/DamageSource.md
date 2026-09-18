---
title: "DamageSource"
description: "public class DamageSource extends java.lang.Object"
package: "net/minecraft/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/DamageSource.html"
sourceType: javadoc
---

# DamageSource

## Class signature

```java
public class DamageSource extends java.lang.Object
```

## Constructors

- `public DamageSource(java.lang.String damageTypeIn)`

## Methods

- `public static DamageSource causeMobDamage( EntityLivingBase mob)`
- `public static DamageSource causeIndirectDamage( Entity source, EntityLivingBase indirectEntityIn)`
- `public static DamageSource causePlayerDamage( EntityPlayer player)`
- `public static DamageSource causeArrowDamage( EntityArrow arrow, Entity indirectEntityIn)`
- `public static DamageSource causeFireballDamage( EntityFireball fireball, Entity indirectEntityIn)`
- `public static DamageSource causeThrownDamage( Entity source, Entity indirectEntityIn)`
- `public static DamageSource causeIndirectMagicDamage( Entity source, Entity indirectEntityIn)`
- `public static DamageSource causeThornsDamage( Entity source)`
- `public static DamageSource causeExplosionDamage( Explosion explosionIn)`
- `public static DamageSource causeExplosionDamage( EntityLivingBase entityLivingBaseIn)`
- `public boolean isProjectile()`
- `public DamageSource setProjectile()`
- `public boolean isExplosion()`
- `public DamageSource setExplosion()`
- `public boolean isUnblockable()`
- `public float getHungerDamage()`
- `public boolean canHarmInCreative()`
- `public boolean isDamageAbsolute()`
- `public Entity getImmediateSource()`
- `public Entity getTrueSource()`
- `public DamageSource setDamageBypassesArmor()`
- `public DamageSource setDamageAllowedInCreativeMode()`
- `public DamageSource setDamageIsAbsolute()`
- `public DamageSource setFireDamage()`
- `public ITextComponent getDeathMessage( EntityLivingBase entityLivingBaseIn)`
- `public boolean isFireDamage()`
- `public java.lang.String getDamageType()`
- `public DamageSource setDifficultyScaled()`
- `public boolean isDifficultyScaled()`
- `public boolean isMagicDamage()`
- `public DamageSource setMagicDamage()`
- `public boolean isCreativePlayer()`
- `public Vec3d getDamageLocation()`
