---
title: "EntityLeashKnot"
description: "public class EntityLeashKnot extends EntityHanging"
package: "net/minecraft/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityLeashKnot.html"
sourceType: javadoc
---

# EntityLeashKnot

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityHanging → net.minecraft.entity.EntityLeashKnot

## Class signature

```java
public class EntityLeashKnot extends EntityHanging
```

## Methods

- `static EntityLeashKnot createKnot(World worldIn, BlockPos fence)`
- `protected void entityInit()`
- `float getEyeHeight()`
- `int getHeightPixels()`
- `static EntityLeashKnot getKnotForPosition(World worldIn, BlockPos pos)`
- `int getWidthPixels()`
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `void onBroken(Entity brokenEntity)` — Called when this entity is broken.
- `boolean onValidSurface()` — checks to make sure painting can be placed there
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void updateFacingWithBoundingBox(EnumFacing facingDirectionIn)` — Updates facing and bounding box based on it
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.
- `boolean writeToNBTOptional(NBTTagCompound tagCompund)` — Either write this entity to the NBT tag given and return true, or return false without doing anything.

## Fields

- `EntityLeashKnot`
- `EntityLeashKnot`
