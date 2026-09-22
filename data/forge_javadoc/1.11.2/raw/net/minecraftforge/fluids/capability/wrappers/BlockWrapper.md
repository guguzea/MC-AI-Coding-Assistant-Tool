---
title: "BlockWrapper"
description: "public class BlockWrapper extends VoidFluidHandler"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/wrappers/BlockWrapper.html"
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
