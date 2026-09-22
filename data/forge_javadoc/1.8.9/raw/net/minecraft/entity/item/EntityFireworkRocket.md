---
title: "EntityFireworkRocket"
description: "public class EntityFireworkRocket extends Entity"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityFireworkRocket.html"
sourceType: javadoc
---

# EntityFireworkRocket

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityFireworkRocket

## Class signature

```java
public class EntityFireworkRocket extends Entity
```

## Methods

- `boolean canAttackWithItem()` — If returns false, the item will not inflict any damage against entities.
- `protected void entityInit()`
- `float getBrightness(float partialTicks)` — Gets how bright this entity is.
- `int getBrightnessForRender(float partialTicks)`
- `void handleStatusUpdate(byte id)`
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setVelocity(double x, double y, double z)` — Sets the velocity to the args.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityFireworkRocket`
- `EntityFireworkRocket`
