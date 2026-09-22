---
title: "EntityWolf"
description: "public class EntityWolf extends EntityTameable"
package: "net/minecraft/entity/passive"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/passive/EntityWolf.html"
sourceType: javadoc
---

# EntityWolf

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityTameable → net.minecraft.entity.passive.EntityWolf

## Class signature

```java
public class EntityWolf extends EntityTameable
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeLeashedTo(EntityPlayer player)`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `EntityWolf createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `EnumDyeColor getCollarColor()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `float getInterestedAngle(float p_70917_1_)`
- `protected ResourceLocation getLootTable()`
- `int getMaxSpawnedInChunk()`
- `float getShadingWhileWet(float p_70915_1_)`
- `float getShakeAngle(float p_70923_1_, float p_70923_2_)`
- `protected float getSoundVolume()`
- `float getTailRotation()`
- `int getVerticalFaceSpeed()`
- `void handleStatusUpdate(byte id)`
- `protected void initEntityAI()`
- `boolean isAngry()`
- `boolean isBegging()`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isWolfWet()`
- `void onLivingUpdate()`
- `void onUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesWolf(DataFixer fixer)`
- `void setAngry(boolean angry)`
- `void setAttackTarget(EntityLivingBase entitylivingbaseIn)`
- `void setBegging(boolean beg)`
- `void setCollarColor(EnumDyeColor collarcolor)`
- `void setTamed(boolean tamed)`
- `boolean shouldAttackEntity(EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityWolf`
