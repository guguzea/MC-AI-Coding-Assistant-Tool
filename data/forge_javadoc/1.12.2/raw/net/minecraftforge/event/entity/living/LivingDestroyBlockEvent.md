---
title: "LivingDestroyBlockEvent"
description: "Fired when the ender dragon or wither attempts to destroy a block and when ever a zombie attempts to break a door. Basically a event version of Block.canEntityDestroy(IBlockState, IBlockAccess, BlockP"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/LivingDestroyBlockEvent.html"
sourceType: javadoc
---

# LivingDestroyBlockEvent

## Class signature

```java
public class LivingDestroyBlockEvent extends LivingEvent
```

## Constructors

- `public LivingDestroyBlockEvent( EntityLivingBase entity, BlockPos pos, IBlockState state)`

## Methods

- `public IBlockState getState()`
- `public BlockPos getPos()`

## Description

Fired when the ender dragon or wither attempts to destroy a block and when ever a zombie attempts to break a door. Basically a event version of Block.canEntityDestroy(IBlockState, IBlockAccess, BlockP
