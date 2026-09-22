---
title: "DamageSource"
description: "public class DamageSource extends java.lang.Object"
package: "net/minecraft/util"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/DamageSource.html"
sourceType: javadoc
---

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
- `Entity getEntity()`
- `float getHungerDamage()`
- `Entity getSourceOfDamage()`
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

- `static DamageSource anvil`
- `static DamageSource cactus`
- `java.lang.String damageType`
- `static DamageSource dragonBreath`
- `static DamageSource drown`
- `static DamageSource fall`
- `static DamageSource fallingBlock`
- `static DamageSource flyIntoWall`
- `static DamageSource generic`
- `static DamageSource inFire`
- `static DamageSource inWall`
- `static DamageSource lava`
- `static DamageSource lightningBolt`
- `static DamageSource magic`
- `static DamageSource onFire`
- `static DamageSource outOfWorld`
- `static DamageSource starve`
- `static DamageSource wither`
