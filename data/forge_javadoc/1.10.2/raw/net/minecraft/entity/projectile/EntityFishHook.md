---
title: "EntityFishHook"
description: "public class EntityFishHook extends Entity"
package: "net/minecraft/entity/projectile"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/projectile/EntityFishHook.html"
sourceType: javadoc
---

# EntityFishHook

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFishHook

## Class signature

```java
public class EntityFishHook extends Entity
```

## Constructors

- `EntityFishHook(World worldIn)`
- `EntityFishHook(World worldIn, double x, double y, double z, EntityPlayer anglerIn)`
- `EntityFishHook(World worldIn, EntityPlayer fishingPlayer)`

## Methods

- `protected void bringInHookedEntity()`
- `protected boolean canBeHooked(Entity p_189739_1_)`
- `protected void entityInit()`
- `void handleHookCasting(double p_146035_1_, double p_146035_3_, double p_146035_5_, float p_146035_7_, float p_146035_8_)`
- `int handleHookRetraction()`
- `void handleStatusUpdate(byte id)`
- `boolean isInRangeToRenderDist(double distance)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setDead()`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setVelocity(double x, double y, double z)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityPlayer angler`
- `Entity caughtEntity`
