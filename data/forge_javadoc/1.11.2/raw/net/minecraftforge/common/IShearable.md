---
title: "IShearable"
description: "This allows for mods to create there own Shear-like items and have them interact with Blocks/Entities without extra work. Also, if your block/entity supports the Shears, this allows you to support mod"
package: "net/minecraftforge/common"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/IShearable.html"
sourceType: javadoc
---

# IShearable

## Class signature

```java
public interface IShearable
```

## Methods

- `boolean isShearable(@Nonnull ItemStack item, IBlockAccess world, BlockPos pos)`
- `java.util.List< ItemStack > onSheared(@Nonnull ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

This allows for mods to create there own Shear-like items and have them interact with Blocks/Entities without extra work. Also, if your block/entity supports the Shears, this allows you to support mod
