---
title: "EntityEnderman"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityEnderman.html"
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

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public float getEyeHeight()`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `protected boolean teleportRandomly()`
- `protected boolean teleportToEntity( Entity p_70816_1_)`
- `protected boolean teleportTo(double x, double y, double z)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public void setHeldBlockState( IBlockState state)`
- `public IBlockState getHeldBlockState()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public static void setCarriable( Block block, boolean canCarry)`
- `public static boolean getCarriable( Block block)`
- `public boolean isScreaming()`
- `public void setScreaming(boolean screaming)`

## Description

Called when the entity is attacked.
