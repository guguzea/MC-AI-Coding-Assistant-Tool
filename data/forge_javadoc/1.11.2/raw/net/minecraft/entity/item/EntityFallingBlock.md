---
title: "EntityFallingBlock"
description: "public class EntityFallingBlock extends Entity"
package: "net/minecraft/entity/item"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/item/EntityFallingBlock.html"
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
- `boolean canBeCollidedWith()`
- `boolean canRenderOnFire()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `IBlockState getBlock()`
- `BlockPos getOrigin()`
- `World getWorldObj()`
- `boolean ignoreItemEntityData()`
- `void onUpdate()`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesFallingBlock(DataFixer fixer)`
- `void setHurtEntities(boolean p_145806_1_)`
- `void setOrigin(BlockPos p_184530_1_)`
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `int fallTime`
- `protected static DataParameter<BlockPos> ORIGIN`
- `boolean shouldDropItem`
- `NBTTagCompound tileEntityData`
