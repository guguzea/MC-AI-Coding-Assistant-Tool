---
title: "EntityEnderman"
description: "public class EntityEnderman extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityEnderman.html"
sourceType: javadoc
---

# EntityEnderman

## Class signature

```java
public class EntityEnderman extends EntityMob
```

## Constructors

- `public EntityEnderman( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public void setAttackTarget(@Nullable EntityLivingBase entitylivingbaseIn)`
- `protected void entityInit()`
- `public void playEndermanSound()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public static void registerFixesEnderman( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public float getEyeHeight()`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `protected boolean teleportRandomly()`
- `protected boolean teleportToEntity( Entity p_70816_1_)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void setHeldBlockState(@Nullable IBlockState state)`
- `@Nullable public IBlockState getHeldBlockState()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public static void setCarriable( Block block, boolean canCarry)`
- `public static boolean getCarriable( Block block)`
- `public boolean isScreaming()`
