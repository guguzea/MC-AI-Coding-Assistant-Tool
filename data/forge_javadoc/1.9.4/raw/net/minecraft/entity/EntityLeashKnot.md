---
title: "EntityLeashKnot"
description: "public class EntityLeashKnot extends EntityHanging"
package: "net/minecraft/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/EntityLeashKnot.html"
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

- `public void setPosition(double x, double y, double z)`
- `protected void updateBoundingBox()`
- `public void updateFacingWithBoundingBox( EnumFacing facingDirectionIn)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public float getEyeHeight()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void onBroken(@Nullable Entity brokenEntity)`
- `public boolean writeToNBTOptional( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean processInitialInteract( EntityPlayer player, @Nullable ItemStack stack, EnumHand hand)`
- `public boolean onValidSurface()`
- `public static EntityLeashKnot createKnot( World worldIn, BlockPos fence)`
- `public static EntityLeashKnot getKnotForPosition( World worldIn, BlockPos pos)`
- `public void playPlaceSound()`
