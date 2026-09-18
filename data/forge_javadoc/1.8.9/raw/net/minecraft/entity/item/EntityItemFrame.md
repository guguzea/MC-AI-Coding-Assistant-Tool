---
title: "EntityItemFrame"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityItemFrame.html"
sourceType: javadoc
---

# EntityItemFrame

## Class signature

```java
public class EntityItemFrame extends EntityHanging
```

## Constructors

- `public EntityItemFrame( World worldIn)`
- `public EntityItemFrame( World worldIn, BlockPos p_i45852_2_, EnumFacing p_i45852_3_)`

## Methods

- `protected void entityInit()`
- `public float getCollisionBorderSize()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void onBroken( Entity brokenEntity)`
- `public void dropItemOrSelf( Entity p_146065_1_, boolean p_146065_2_)`
- `public ItemStack getDisplayedItem()`
- `public void setDisplayedItem( ItemStack p_82334_1_)`
- `public int getRotation()`
- `public void setItemRotation(int p_82336_1_)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `public int func_174866_q()`

## Description

Called when the entity is attacked.
