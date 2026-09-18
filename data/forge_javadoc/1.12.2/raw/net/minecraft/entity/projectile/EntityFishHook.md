---
title: "EntityFishHook"
description: "public class EntityFishHook extends Entity"
package: "net/minecraft/entity/projectile"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/projectile/EntityFishHook.html"
sourceType: javadoc
---

# EntityFishHook

## Class signature

```java
public class EntityFishHook extends Entity
```

## Constructors

- `public EntityFishHook( World worldIn, EntityPlayer p_i47290_2_, double x, double y, double z)`
- `public EntityFishHook( World worldIn, EntityPlayer fishingPlayer)`

## Methods

- `public void setLureSpeed(int p_191516_1_)`
- `public void setLuck(int p_191517_1_)`
- `protected void entityInit()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public void onUpdate()`
- `protected boolean canBeHooked( Entity p_189739_1_)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public int handleHookRetraction()`
- `public void handleStatusUpdate(byte id)`
- `protected void bringInHookedEntity()`
- `protected boolean canTriggerWalking()`
- `public void setDead()`
- `public EntityPlayer getAngler()`
