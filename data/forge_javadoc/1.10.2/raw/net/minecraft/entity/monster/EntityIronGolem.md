---
title: "EntityIronGolem"
description: "public class EntityIronGolem extends EntityGolem"
package: "net/minecraft/entity/monster"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntityIronGolem.html"
sourceType: javadoc
---

# EntityIronGolem

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityGolem → net.minecraft.entity.monster.EntityIronGolem

## Class signature

```java
public class EntityIronGolem extends EntityGolem
```

## Constructors

- `EntityIronGolem(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean canAttackClass(java.lang.Class<? extends EntityLivingBase> cls)`
- `protected void collideWithEntity(Entity entityIn)`
- `protected int decreaseAirSupply(int air)`
- `protected void entityInit()`
- `int getAttackTimer()`
- `protected SoundEvent getDeathSound()`
- `int getHoldRoseTick()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `Village getVillage()`
- `void handleStatusUpdate(byte id)`
- `protected void initEntityAI()`
- `boolean isPlayerCreated()`
- `void onDeath(DamageSource cause)`
- `void onLivingUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesIronGolem(DataFixer fixer)`
- `void setHoldingRose(boolean p_70851_1_)`
- `void setPlayerCreated(boolean playerCreated)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected static DataParameter<java.lang.Byte> PLAYER_CREATED`
