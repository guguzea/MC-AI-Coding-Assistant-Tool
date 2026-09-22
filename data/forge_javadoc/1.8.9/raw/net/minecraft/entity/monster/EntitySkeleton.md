---
title: "EntitySkeleton"
description: "public class EntitySkeleton extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntitySkeleton.html"
sourceType: javadoc
---

# EntitySkeleton

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntitySkeleton

## Class signature

```java
public class EntitySkeleton extends EntityMob implements IRangedAttackMob
```

## Methods

- `protected void addRandomDrop()` — Causes this Entity to drop a random item.
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `void attackEntityWithRangedAttack(EntityLivingBase p_82196_1_, float p_82196_2_)` — Attack the specified entity using a ranged attack.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `EnumCreatureAttribute getCreatureAttribute()` — Get this Entity's EnumCreatureAttribute
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getSkeletonType()` — Return this skeleton's type.
- `double getYOffset()` — Returns the Y Offset of this entity.
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setCombatTask()` — sets this entity's combat AI.
- `void setCurrentItemOrArmor(int slotIn, ItemStack stack)` — Sets the held item, or an armor slot.
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)` — Gives armor or weapon for entity based on given DifficultyInstance
- `void setSkeletonType(int p_82201_1_)` — Set this skeleton's type.
- `void updateRidden()` — Handles updating while being ridden by an entity
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntitySkeleton`
