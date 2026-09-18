---
title: "IShearable"
description: "This allows for mods to create there own Shear-like items and have them interact with Blocks/Entities without extra work. Also, if your block/entity supports the Shears, this allows you to support mod"
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/IShearable.html"
sourceType: javadoc
---

# IShearable

## Class signature

```java
public interface IShearable
```

## Methods

- `boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

This allows for mods to create there own Shear-like items and have them interact with Blocks/Entities without extra work. Also, if your block/entity supports the Shears, this allows you to support mod
