---
title: "EntitySkeleton"
description: "Causes this Entity to drop a random item."
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntitySkeleton.html"
sourceType: javadoc
---

# EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public EntitySkeleton( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public void onLivingUpdate()`
- `public void updateRidden()`
- `public void onDeath( DamageSource cause)`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected void addRandomDrop()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public void setCombatTask()`
- `public void attackEntityWithRangedAttack( EntityLivingBase p_82196_1_, float p_82196_2_)`
- `public int getSkeletonType()`
- `public void setSkeletonType(int p_82201_1_)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public float getEyeHeight()`
- `public double getYOffset()`

## Description

Causes this Entity to drop a random item.
