---
title: "EntityEnderCrystal"
description: "public class EntityEnderCrystal extends Entity"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityEnderCrystal.html"
sourceType: javadoc
---

# EntityEnderCrystal

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityEnderCrystal

## Class signature

```java
public class EntityEnderCrystal extends Entity
```

## Constructors

- `EntityEnderCrystal(World worldIn)`
- `EntityEnderCrystal(World worldIn, double p_i1699_2_, double p_i1699_4_, double p_i1699_6_)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void entityInit()`
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int health`
- `int innerRotation` — Used to create the rotation animation when rendering the crystal.
