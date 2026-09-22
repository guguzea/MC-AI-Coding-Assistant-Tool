---
title: "EntityDragon"
description: "public class EntityDragon extends EntityLiving implements IEntityMultiPart, IMob"
package: "net/minecraft/entity/boss"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/boss/EntityDragon.html"
sourceType: javadoc
---

# EntityDragon

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.boss.EntityDragon

## Class signature

```java
public class EntityDragon extends EntityLiving implements IEntityMultiPart, IMob
```

## Constructors

- `EntityDragon(World worldIn)`

## Methods

- `void addPotionEffect(PotionEffect potioneffectIn)`
- `protected void applyEntityAttributes()`
- `protected boolean attackDragonFrom(DamageSource source, float amount)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean attackEntityFromPart(MultiPartEntityPart dragonPart, DamageSource source, float damage)`
- `boolean canBeCollidedWith()`
- `protected boolean canBeRidden(Entity entityIn)`
- `protected void despawnEntity()`
- `protected void entityInit()`
- `Path findPath(int startIdx, int finishIdx, PathPoint andThen)`
- `protected SoundEvent getAmbientSound()`
- `DragonFightManager getFightManager()`
- `Vec3d getHeadLookVec(float p_184665_1_)`
- `float getHeadPartYOffset(int p_184667_1_, double[] p_184667_2_, double[] p_184667_3_)`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `double[] getMovementOffsets(int p_70974_1_, float p_70974_2_)`
- `int getNearestPpIdx(double x, double y, double z)`
- `Entity [] getParts()`
- `PhaseManager getPhaseManager()`
- `SoundCategory getSoundCategory()`
- `protected float getSoundVolume()`
- `World getWorld()`
- `int initPathPoints()`
- `boolean isNonBoss()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc)`
- `protected void onDeathUpdate()`
- `void onKillCommand()`
- `void onLivingUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesDragon(DataFixer fixer)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `float animTime`
- `int deathTicks`
- `MultiPartEntityPart [] dragonPartArray`
- `MultiPartEntityPart dragonPartBody`
- `MultiPartEntityPart dragonPartHead`
- `MultiPartEntityPart dragonPartNeck`
- `MultiPartEntityPart dragonPartTail1`
- `MultiPartEntityPart dragonPartTail2`
- `MultiPartEntityPart dragonPartTail3`
- `MultiPartEntityPart dragonPartWing1`
- `MultiPartEntityPart dragonPartWing2`
- `EntityEnderCrystal healingEnderCrystal`
- `static DataParameter<java.lang.Integer> PHASE`
- `float prevAnimTime`
- `double[][] ringBuffer`
- `int ringBufferIndex`
- `boolean slowed`
