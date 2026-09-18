---
title: "AbstractSkeleton"
description: "public abstract class AbstractSkeleton extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/AbstractSkeleton.html"
sourceType: javadoc
---

# AbstractSkeleton

## Class signature

```java
public abstract class AbstractSkeleton extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public AbstractSkeleton( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected abstract SoundEvent getStepSound()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public void onLivingUpdate()`
- `public void updateRidden()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public void setCombatTask()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `protected EntityArrow getArrow(float p_190726_1_)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, ItemStack stack)`
- `public float getEyeHeight()`
- `public double getYOffset()`
- `public boolean isSwingingArms()`
- `public void setSwingingArms(boolean swingingArms)`
