---
title: "EntityMooshroom"
description: "Checks if the object is currently shearable Example: Sheep return false when they have no wool"
package: "net/minecraft/entity/passive"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/EntityMooshroom.html"
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

- `public static void registerFixesMooshroom( DataFixer fixer)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public EntityMooshroom createChild( EntityAgeable ageable)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `protected ResourceLocation getLootTable()`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool
