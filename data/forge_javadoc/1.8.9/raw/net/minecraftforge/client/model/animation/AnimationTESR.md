---
title: "AnimationTESR"
description: "Generic TileEntitySpecialRenderer that works with the Forge model system and animations."
package: "net/minecraftforge/client/model/animation"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/animation/AnimationTESR.html"
sourceType: javadoc
---

# AnimationTESR

## Class signature

```java
public class AnimationTESR<T extends TileEntity & IAnimationProvider > extends FastTESR <T> implements IEventHandler <T>
```

## Constructors

- `public AnimationTESR()`

## Methods

- `protected static IBakedModel getModel( IExtendedBlockState state, IModelState modelState)`
- `public void renderTileEntityFast( T te, double x, double y, double z, float partialTick, int breakStage, WorldRenderer renderer)`
- `public void handleEvents( T te, float time, java.lang.Iterable< Event > pastEvents)`

## Description

Generic TileEntitySpecialRenderer that works with the Forge model system and animations.
