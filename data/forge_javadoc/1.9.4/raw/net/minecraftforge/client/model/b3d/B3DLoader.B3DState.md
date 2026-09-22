---
title: "B3DLoader.B3DState"
description: "public static final class B3DLoader.B3DState extends java.lang.Object implements IModelState"
package: "net/minecraftforge/client/model/b3d"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/b3d/B3DLoader.B3DState.html"
sourceType: javadoc
---

# B3DLoader.B3DState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DLoader.B3DState

## Class signature

```java
public static final class B3DLoader.B3DState extends java.lang.Object implements IModelState
```

## Constructors

- `B3DState(B3DModel.Animation animation, int frame)`
- `B3DState(B3DModel.Animation animation, int frame, IModelState parent)`
- `B3DState(B3DModel.Animation animation, int frame, int nextFrame, float progress)`
- `B3DState(B3DModel.Animation animation, int frame, int nextFrame, float progress, IModelState parent)`

## Methods

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`
- `B3DModel.Animation getAnimation()`
- `int getFrame()`
- `int getNextFrame()`
- `static TRSRTransformation getNodeMatrix(B3DModel.Animation animation, B3DModel.Node<?> node, int frame)`
- `TRSRTransformation getNodeMatrix(B3DModel.Node<?> node)`
- `TRSRTransformation getNodeMatrix(B3DModel.Node<?> node, int frame)`
- `IModelState getParent()`
- `float getProgress()`
