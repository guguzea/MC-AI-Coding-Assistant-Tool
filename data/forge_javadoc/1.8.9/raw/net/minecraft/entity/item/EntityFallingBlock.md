---
title: "EntityFallingBlock"
description: "Returns true if other Entities should be prevented from moving through this Entity."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityFallingBlock.html"
sourceType: javadoc
---

# EntityFallingBlock

## Class signature

```java
public class EntityFallingBlock extends Entity
```

## Constructors

- `public EntityFallingBlock( World worldIn)`
- `public EntityFallingBlock( World worldIn, double x, double y, double z, IBlockState fallingBlockState)`

## Methods

- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public boolean canBeCollidedWith()`
- `public void onUpdate()`
- `public void fall(float distance, float damageMultiplier)`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void setHurtEntities(boolean p_145806_1_)`
- `public void addEntityCrashInfo( CrashReportCategory category)`
- `public World getWorldObj()`
- `public boolean canRenderOnFire()`
- `public IBlockState getBlock()`

## Description

Returns true if other Entities should be prevented from moving through this Entity.
