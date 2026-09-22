---
title: "EntityFishHook"
description: "public class EntityFishHook extends Entity"
package: "net/minecraft/entity/projectile"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/projectile/EntityFishHook.html"
sourceType: javadoc
---

# EntityFishHook

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFishHook

## Class signature

```java
public class EntityFishHook extends Entity
```

## Constructors

- `EntityFishHook(World worldIn, EntityPlayer fishingPlayer)`
- `EntityFishHook(World worldIn, EntityPlayer p_i47290_2_, double x, double y, double z)`

## Methods

- `protected void bringInHookedEntity()`
- `protected boolean canBeHooked(Entity p_189739_1_)`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `EntityPlayer getAngler()`
- `int handleHookRetraction()`
- `void handleStatusUpdate(byte id)`
- `boolean isInRangeToRenderDist(double distance)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setDead()`
- `void setLuck(int p_191517_1_)`
- `void setLureSpeed(int p_191516_1_)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `Entity caughtEntity`
