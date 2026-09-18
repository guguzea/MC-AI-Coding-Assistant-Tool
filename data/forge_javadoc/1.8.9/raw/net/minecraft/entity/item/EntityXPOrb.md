---
title: "EntityXPOrb"
description: "A constantly increasing value that RenderXPOrb uses to control the colour shifting (Green / yellow)"
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityXPOrb.html"
sourceType: javadoc
---

# EntityXPOrb

## Class signature

```java
public class EntityXPOrb extends Entity
```

## Constructors

- `public EntityXPOrb( World worldIn, double x, double y, double z, int expValue)`
- `public EntityXPOrb( World worldIn)`

## Methods

- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public int getBrightnessForRender(float partialTicks)`
- `public void onUpdate()`
- `public boolean handleWaterMovement()`
- `protected void dealFireDamage(int amount)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `public int getXpValue()`
- `public int getTextureByXP()`
- `public static int getXPSplit(int expValue)`
- `public boolean canAttackWithItem()`

## Description

A constantly increasing value that RenderXPOrb uses to control the colour shifting (Green / yellow)
