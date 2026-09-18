---
title: "EntityLeashKnot"
description: "First layer of player interaction"
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityLeashKnot.html"
sourceType: javadoc
---

# EntityLeashKnot

## Class signature

```java
public class EntityLeashKnot extends EntityHanging
```

## Constructors

- `public EntityLeashKnot( World worldIn)`
- `public EntityLeashKnot( World worldIn, BlockPos hangingPositionIn)`

## Methods

- `protected void entityInit()`
- `public void updateFacingWithBoundingBox( EnumFacing facingDirectionIn)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public float getEyeHeight()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void onBroken( Entity brokenEntity)`
- `public boolean writeToNBTOptional( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `public boolean onValidSurface()`
- `public static EntityLeashKnot createKnot( World worldIn, BlockPos fence)`
- `public static EntityLeashKnot getKnotForPosition( World worldIn, BlockPos pos)`

## Description

First layer of player interaction
