---
title: "EntityGuardian"
description: "public class EntityGuardian extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityGuardian.html"
sourceType: javadoc
---

# EntityGuardian

## Class signature

```java
public class EntityGuardian extends EntityMob
```

## Constructors

- `public EntityGuardian( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public static void registerFixesGuardian( DataFixer fixer)`
- `protected PathNavigate createNavigator( World worldIn)`
- `protected void entityInit()`
- `public boolean isMoving()`
- `public int getAttackDuration()`
- `public boolean hasTargetedEntity()`
- `@Nullable public EntityLivingBase getTargetedEntity()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public int getTalkInterval()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected boolean canTriggerWalking()`
- `public float getEyeHeight()`
- `public float getBlockPathWeight( BlockPos pos)`
- `public void onLivingUpdate()`
- `protected SoundEvent getFlopSound()`
- `public float getTailAnimation(float p_175471_1_)`
- `public float getSpikesAnimation(float p_175469_1_)`
- `public float getAttackAnimationScale(float p_175477_1_)`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected boolean isValidLightLevel()`
- `public boolean isNotColliding()`
- `public boolean getCanSpawnHere()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public int getVerticalFaceSpeed()`
- `public void moveEntityWithHeading(float strafe, float forward)`
