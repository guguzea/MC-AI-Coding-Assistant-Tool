---
title: "EntityItem"
description: "The EntityItem's random initial float height."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityItem.html"
sourceType: javadoc
---

# EntityItem

## Class signature

```java
public class EntityItem extends Entity
```

## Constructors

- `public EntityItem( World worldIn, double x, double y, double z)`
- `public EntityItem( World worldIn, double x, double y, double z, ItemStack stack)`
- `public EntityItem( World worldIn)`

## Methods

- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public void onUpdate()`
- `public void setAgeToCreativeDespawnTime()`
- `public boolean handleWaterMovement()`
- `protected void dealFireDamage(int amount)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `public java.lang.String getName()`
- `public boolean canAttackWithItem()`
- `public void travelToDimension(int dimensionId)`
- `public ItemStack getEntityItem()`
- `public void setEntityItemStack( ItemStack stack)`
- `public java.lang.String getOwner()`
- `public void setOwner(java.lang.String owner)`
- `public java.lang.String getThrower()`
- `public void setThrower(java.lang.String thrower)`
- `public int getAge()`
- `public void setDefaultPickupDelay()`
- `public void setNoPickupDelay()`
- `public void setInfinitePickupDelay()`
- `public void setPickupDelay(int ticks)`
- `public boolean cannotPickup()`
- `public void setNoDespawn()`
- `public void func_174870_v()`

## Description

The EntityItem's random initial float height.
