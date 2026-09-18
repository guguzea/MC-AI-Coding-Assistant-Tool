---
title: "EntityMinecartCommandBlock"
description: "First layer of player interaction"
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityMinecartCommandBlock.html"
sourceType: javadoc
---

# EntityMinecartCommandBlock

## Class signature

```java
public class EntityMinecartCommandBlock extends EntityMinecart
```

## Constructors

- `public EntityMinecartCommandBlock( World worldIn)`
- `public EntityMinecartCommandBlock( World worldIn, double x, double y, double z)`

## Methods

- `protected void entityInit()`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public EntityMinecart.EnumMinecartType getMinecartType()`
- `public IBlockState getDefaultDisplayTile()`
- `public CommandBlockLogic getCommandBlockLogic()`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `public void onDataWatcherUpdate(int dataID)`

## Description

First layer of player interaction
