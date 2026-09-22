---
title: "AbstractSkeleton"
description: "public abstract class AbstractSkeleton extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/AbstractSkeleton.html"
sourceType: javadoc
---

# AbstractSkeleton

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.AbstractSkeleton

## Class signature

```java
public abstract class AbstractSkeleton extends EntityMob implements IRangedAttackMob
```

## Methods

- `protected void applyEntityAttributes()`
- `void attackEntityWithRangedAttack(EntityLivingBase target, float distanceFactor)`
- `protected void entityInit()`
- `protected EntityArrow getArrow(float p_190726_1_)`
- `EnumCreatureAttribute getCreatureAttribute()`
- `float getEyeHeight()`
- `protected abstract SoundEvent getStepSound()`
- `double getYOffset()`
- `protected void initEntityAI()`
- `boolean isSwingingArms()`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setCombatTask()`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setSwingingArms(boolean swingingArms)`
- `void updateRidden()`

## Fields

- `AbstractSkeleton`
