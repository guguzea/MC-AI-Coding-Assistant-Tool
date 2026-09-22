---
title: "EntityFallingBlock"
description: "public class EntityFallingBlock extends Entity"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityFallingBlock.html"
sourceType: javadoc
---

# EntityFallingBlock

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityFallingBlock

## Class signature

```java
public class EntityFallingBlock extends Entity
```

## Constructors

- `EntityFallingBlock(World worldIn)`
- `EntityFallingBlock(World worldIn, double x, double y, double z, IBlockState fallingBlockState)`

## Methods

- `void addEntityCrashInfo(CrashReportCategory category)`
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `boolean canRenderOnFire()` — Return whether this entity should be rendered as on fire.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `IBlockState getBlock()`
- `World getWorldObj()`
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setHurtEntities(boolean p_145806_1_)`
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int fallTime`
- `boolean shouldDropItem`
- `NBTTagCompound tileEntityData`
