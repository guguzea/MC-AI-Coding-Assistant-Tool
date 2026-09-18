---
title: "BlockLiquidWrapper"
description: "Wrapper to handle vanilla Water or Lava as an IFluidHandler. Methods are modeled after ItemBucket.onItemRightClick(World, EntityPlayer, EnumHand)"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/wrappers/BlockLiquidWrapper.html"
sourceType: javadoc
---

# BlockLiquidWrapper

## Class signature

```java
public class BlockLiquidWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `public BlockLiquidWrapper( BlockLiquid blockLiquid, World world, BlockPos blockPos)`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `@Nullable public FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Wrapper to handle vanilla Water or Lava as an IFluidHandler. Methods are modeled after ItemBucket.onItemRightClick(World, EntityPlayer, EnumHand)
