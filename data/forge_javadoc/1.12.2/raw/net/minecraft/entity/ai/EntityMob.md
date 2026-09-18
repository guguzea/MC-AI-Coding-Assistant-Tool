---
title: "EntityMob"
description: "public abstract class EntityMob extends EntityCreature implements IMob"
package: "net/minecraft/entity/ai"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntityMob.html"
sourceType: javadoc
---

# EntityMob

## Class signature

```java
public abstract class EntityMob extends EntityCreature implements IMob
```

## Constructors

- `public EntityMob( World worldIn)`

## Methods

- `public SoundCategory getSoundCategory()`
- `public void onLivingUpdate()`
- `public void onUpdate()`
- `protected SoundEvent getSwimSound()`
- `protected SoundEvent getSplashSound()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getFallSound(int heightIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public float getBlockPathWeight( BlockPos pos)`
- `protected boolean isValidLightLevel()`
- `public boolean getCanSpawnHere()`
- `protected void applyEntityAttributes()`
- `protected boolean canDropLoot()`
- `public boolean isPreventingPlayerRest( EntityPlayer playerIn)`
