---
title: "EntityRabbit"
description: "Causes this Entity to drop a random item."
package: "net/minecraft/entity/passive"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityRabbit.html"
sourceType: javadoc
---

# EntityRabbit

## Class signature

```java
public class EntityRabbit extends EntityAnimal
```

## Constructors

- `public EntityRabbit( World worldIn)`

## Methods

- `protected float getJumpUpwardsMotion()`
- `public void setMoveType(net.minecraft.entity.passive.EntityRabbit.EnumMoveType type)`
- `public float func_175521_o(float p_175521_1_)`
- `public void setMovementSpeed(double newSpeed)`
- `public void setJumping(boolean jump, net.minecraft.entity.passive.EntityRabbit.EnumMoveType moveTypeIn)`
- `public void doMovementAction(net.minecraft.entity.passive.EntityRabbit.EnumMoveType movetype)`
- `public boolean func_175523_cj()`
- `protected void entityInit()`
- `public void updateAITasks()`
- `public void spawnRunningParticles()`
- `public void onLivingUpdate()`
- `protected void applyEntityAttributes()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected java.lang.String getJumpingSound()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public int getTotalArmorValue()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void addRandomDrop()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public EntityRabbit createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public int getRabbitType()`
- `public void setRabbitType(int rabbitTypeId)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `protected int getMoveTypeDuration()`
- `protected void createEatingParticles()`
- `public void handleStatusUpdate(byte id)`

## Description

Causes this Entity to drop a random item.
