---
title: "AnimationTESR"
description: "Generic TileEntitySpecialRenderer that works with the Forge model system and animations."
package: "net/minecraftforge/client/model/animation"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/animation/AnimationTESR.html"
sourceType: javadoc
---

# AnimationTESR

## Class signature

```java
public class AnimationTESR<T extends TileEntity > extends FastTESR <T> implements IEventHandler <T>
```

## Constructors

- `public AnimationTESR()`

## Methods

- `public void renderTileEntityFast(@Nonnull T te, double x, double y, double z, float partialTick, int breakStage, @Nonnull VertexBuffer renderer)`
- `public void handleEvents( T te, float time, java.lang.Iterable< Event > pastEvents)`

## Description

Generic TileEntitySpecialRenderer that works with the Forge model system and animations.
