---
title: "EntityMooshroom"
description: "Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig."
package: "net/minecraft/entity/passive"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityMooshroom.html"
sourceType: javadoc
---

# EntityMooshroom

## Class signature

```java
public class EntityMooshroom extends EntityCow implements IShearable
```

## Constructors

- `public EntityMooshroom( World worldIn)`

## Methods

- `public boolean interact( EntityPlayer player)`
- `public EntityMooshroom createChild( EntityAgeable ageable)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
