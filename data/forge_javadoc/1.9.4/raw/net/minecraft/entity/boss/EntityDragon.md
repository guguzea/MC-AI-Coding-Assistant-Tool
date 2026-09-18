---
title: "EntityDragon"
description: "public class EntityDragon extends EntityLiving implements IEntityMultiPart , IMob"
package: "net/minecraft/entity/boss"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/boss/EntityDragon.html"
sourceType: javadoc
---

# EntityDragon

## Class signature

```java
public class EntityDragon extends EntityLiving implements IEntityMultiPart , IMob
```

## Constructors

- `public EntityDragon( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public double[] getMovementOffsets(int p_70974_1_, float p_70974_2_)`
- `public void onLivingUpdate()`
- `public boolean attackEntityFromPart( EntityDragonPart dragonPart, DamageSource source, float damage)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected boolean attackDragonFrom( DamageSource source, float amount)`
- `public void onKillCommand()`
- `protected void onDeathUpdate()`
- `public int initPathPoints()`
- `public int getNearestPpIdx(double x, double y, double z)`
- `@Nullable public Path findPath(int startIdx, int finishIdx, @Nullable PathPoint andThen)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected void despawnEntity()`
- `public Entity [] getParts()`
- `public boolean canBeCollidedWith()`
- `public World getWorld()`
- `public SoundCategory getSoundCategory()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected float getSoundVolume()`
- `public float getHeadPartYOffset(int p_184667_1_, double[] p_184667_2_, double[] p_184667_3_)`
- `public Vec3d getHeadLookVec(float p_184665_1_)`
- `public void onCrystalDestroyed( EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public PhaseManager getPhaseManager()`
- `@Nullable public DragonFightManager getFightManager()`
- `public void addPotionEffect( PotionEffect potioneffectIn)`
- `protected boolean canBeRidden( Entity entityIn)`
- `public boolean isNonBoss()`
