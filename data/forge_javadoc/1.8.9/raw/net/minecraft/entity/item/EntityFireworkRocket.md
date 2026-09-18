---
title: "EntityFireworkRocket"
description: "If returns false, the item will not inflict any damage against entities."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityFireworkRocket.html"
sourceType: javadoc
---

# EntityFireworkRocket

## Class signature

```java
public class EntityFireworkRocket extends Entity
```

## Constructors

- `public EntityFireworkRocket( World worldIn)`
- `public EntityFireworkRocket( World worldIn, double x, double y, double z, ItemStack givenItem)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void handleStatusUpdate(byte id)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public float getBrightness(float partialTicks)`
- `public int getBrightnessForRender(float partialTicks)`
- `public boolean canAttackWithItem()`

## Description

If returns false, the item will not inflict any damage against entities.
