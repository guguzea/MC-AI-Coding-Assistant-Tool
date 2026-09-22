---
title: "EntitySkeleton"
description: "public class EntitySkeleton extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntitySkeleton.html"
sourceType: javadoc
---

# EntitySkeleton

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends EntityMob implements IRangedAttackMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `void attackEntityWithRangedAttack(EntityLivingBase target, float distanceFactor)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `SkeletonType getSkeletonType()`
- `double getYOffset()`
- `protected void initEntityAI()`
- `boolean isSwingingArms()`
- `void onDeath(DamageSource cause)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesSkeleton(DataFixer fixer)`
- `void setCombatTask()`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setSkeletonType(SkeletonType type)`
- `void setSwingingArms(boolean swingingArms)`
- `void updateRidden()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntitySkeleton`
