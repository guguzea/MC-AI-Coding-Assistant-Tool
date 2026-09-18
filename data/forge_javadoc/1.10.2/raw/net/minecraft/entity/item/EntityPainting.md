---
title: "EntityPainting"
description: "public class EntityPainting extends EntityHanging"
package: "net/minecraft/entity/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/item/EntityPainting.html"
sourceType: javadoc
---

# EntityPainting

## Class signature

```java
public class EntityPainting extends EntityHanging
```

## Constructors

- `public EntityPainting( World worldIn)`
- `public EntityPainting( World worldIn, BlockPos pos, EnumFacing facing)`
- `public EntityPainting( World worldIn, BlockPos pos, EnumFacing facing, java.lang.String title)`

## Methods

- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public void onBroken(@Nullable Entity brokenEntity)`
- `public void playPlaceSound()`
- `public void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
