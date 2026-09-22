---
title: "AnimationTESR"
description: "public class AnimationTESR<T extends TileEntity & IAnimationProvider> extends FastTESR<T> implements IEventHandler<T>"
package: "net/minecraftforge/client/model/animation"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/animation/AnimationTESR.html"
sourceType: javadoc
---

# AnimationTESR

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer<T> → net.minecraftforge.client.model.animation.FastTESR<T> → net.minecraftforge.client.model.animation.AnimationTESR<T>

## Class signature

```java
public class AnimationTESR<T extends TileEntity & IAnimationProvider> extends FastTESR<T> implements IEventHandler<T>
```

## Constructors

- `AnimationTESR()`

## Methods

- `protected static IBakedModel getModel(IExtendedBlockState state, IModelState modelState)`
- `void handleEvents(T te, float time, java.lang.Iterable<Event> pastEvents)`
- `void renderTileEntityFast(T te, double x, double y, double z, float partialTick, int breakStage, WorldRenderer renderer)`

## Fields

- `protected static BlockRendererDispatcher blockRenderer`
- `protected static<any> modelCache`
