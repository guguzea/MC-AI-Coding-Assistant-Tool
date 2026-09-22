---
title: "BlockWrapper"
description: "public class BlockWrapper extends VoidFluidHandler"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/wrappers/BlockWrapper.html"
sourceType: javadoc
---

# BlockWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.templates.VoidFluidHandler → net.minecraftforge.fluids.capability.wrappers.BlockWrapper

## Class signature

```java
public class BlockWrapper extends VoidFluidHandler
```

## Constructors

- `BlockWrapper(Block block, World world, BlockPos blockPos)`

## Methods

- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.

## Fields

- `protected Block block`
- `protected BlockPos blockPos`
- `protected World world`
