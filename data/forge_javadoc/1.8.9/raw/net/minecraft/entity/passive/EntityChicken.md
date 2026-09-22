---
title: "EntityChicken"
description: "public class EntityChicken extends EntityAnimal"
package: "net/minecraft/entity/passive"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityChicken.html"
sourceType: javadoc
---

# EntityChicken

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityChicken

## Class signature

```java
public class EntityChicken extends EntityAnimal
```

## Constructors

- `EntityChicken(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `EntityChicken createChild(EntityAgeable ageable)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `void fall(float distance, float damageMultiplier)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `protected int getExperiencePoints(EntityPlayer player)` — Get the experience points the entity currently has.
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `boolean isBreedingItem(ItemStack stack)` — Checks if the parameter is an item which this animal can be fed to breed it (wheat, carrots or seeds depending on the animal type)
- `boolean isChickenJockey()` — Determines if this chicken is a jokey with a zombie riding it.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setChickenJockey(boolean jockey)` — Sets whether this chicken is a jockey or not.
- `void updateRiderPosition()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `boolean chickenJockey`
- `float destPos`
- `float field_70884_g`
- `float field_70888_h`
- `int timeUntilNextEgg` — The time until the next egg is spawned.
- `float wingRotation`
- `float wingRotDelta`
