---
title: "B3DLoader.B3DState"
description: "public static class B3DLoader.B3DState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model/b3d"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/b3d/B3DLoader.B3DState.html"
sourceType: javadoc
---

# B3DLoader.B3DState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DLoader.B3DState

## Class signature

```java
public static class B3DLoader.B3DState extends java.lang.Object implements IModelState
```

## Constructors

- `B3DState(B3DModel.Animation animation, int frame)`
- `B3DState(B3DModel.Animation animation, int frame, IModelState parent)`
- `B3DState(B3DModel.Animation animation, int frame, int nextFrame, float progress)`
- `B3DState(B3DModel.Animation animation, int frame, int nextFrame, float progress, IModelState parent)`

## Methods

- `<any> apply(<any> part)`
- `B3DModel.Animation getAnimation()`
- `int getFrame()`
- `int getNextFrame()`
- `static TRSRTransformation getNodeMatrix(B3DModel.Animation animation, B3DModel.Node<?> node, int frame)`
- `TRSRTransformation getNodeMatrix(B3DModel.Node<?> node)`
- `TRSRTransformation getNodeMatrix(B3DModel.Node<?> node, int frame)`
- `IModelState getParent()`
- `float getProgress()`
