---
title: "EntityVindicator"
description: "public class EntityVindicator extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityVindicator.html"
sourceType: javadoc
---

# EntityVindicator

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityVindicator

## Class signature

```java
public class EntityVindicator extends EntityMob
```

## Constructors

- `EntityVindicator(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `protected void initEntityAI()`
- `boolean isAggressive()`
- `boolean isOnSameTeam(Entity entityIn)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesVindicator(DataFixer fixer)`
- `void setAggressive(boolean p_190636_1_)`
- `void setCustomNameTag(java.lang.String name)`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected static DataParameter<java.lang.Byte> DATA_FLAGS_ID`
