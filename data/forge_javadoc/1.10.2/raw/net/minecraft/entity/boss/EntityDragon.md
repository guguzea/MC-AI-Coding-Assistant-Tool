---
title: "EntityDragon"
description: "public class EntityDragon extends EntityLiving implements IEntityMultiPart, IMob"
package: "net/minecraft/entity/boss"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/boss/EntityDragon.html"
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
- `boolean attackEntityFromPart(EntityDragonPart dragonPart, DamageSource source, float damage)`
- `boolean canBeCollidedWith()`
- `protected boolean canBeRidden(Entity entityIn)`
- `protected void despawnEntity()`
- `protected void entityInit()`
- `Path findPath(int startIdx, int finishIdx, PathPoint andThen)`
- `protected SoundEvent getAmbientSound()`
- `DragonFightManager getFightManager()`
- `Vec3d getHeadLookVec(float p_184665_1_)`
- `float getHeadPartYOffset(int p_184667_1_, double[] p_184667_2_, double[] p_184667_3_)`
- `protected SoundEvent getHurtSound()`
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
- `EntityDragonPart [] dragonPartArray`
- `EntityDragonPart dragonPartBody`
- `EntityDragonPart dragonPartHead`
- `EntityDragonPart dragonPartNeck`
- `EntityDragonPart dragonPartTail1`
- `EntityDragonPart dragonPartTail2`
- `EntityDragonPart dragonPartTail3`
- `EntityDragonPart dragonPartWing1`
- `EntityDragonPart dragonPartWing2`
- `EntityEnderCrystal healingEnderCrystal`
- `static DataParameter<java.lang.Integer> PHASE`
- `float prevAnimTime`
- `double[][] ringBuffer`
- `int ringBufferIndex`
- `boolean slowed`
