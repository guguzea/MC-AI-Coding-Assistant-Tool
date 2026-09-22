---
title: "EntityPainting"
description: "public class EntityPainting extends EntityHanging"
package: "net/minecraft/entity/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/item/EntityPainting.html"
sourceType: javadoc
---

# EntityPainting

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityHanging → net.minecraft.entity.item.EntityPainting

## Class signature

```java
public class EntityPainting extends EntityHanging
```

## Constructors

- `EntityPainting(World worldIn)`
- `EntityPainting(World worldIn, BlockPos pos, EnumFacing facing)`
- `EntityPainting(World worldIn, BlockPos pos, EnumFacing facing, java.lang.String title)`

## Methods

- `int getHeightPixels()`
- `int getWidthPixels()`
- `void onBroken(Entity brokenEntity)`
- `void playPlaceSound()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityPainting.EnumArt art`
