---
title: "B3DLoader.B3DState"
description: ""
package: "net/minecraftforge/client/model/b3d"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/b3d/B3DLoader.B3DState.html"
sourceType: javadoc
---

# B3DLoader.B3DState

## Constructors

- `public B3DState( B3DModel.Animation animation, int frame)`
- `public B3DState( B3DModel.Animation animation, int frame, IModelState parent)`
- `public B3DState( B3DModel.Animation animation, int frame, int nextFrame, float progress)`
- `public B3DState( B3DModel.Animation animation, int frame, int nextFrame, float progress, IModelState parent)`

## Methods

- `public B3DModel.Animation getAnimation()`
- `public int getFrame()`
- `public int getNextFrame()`
- `public float getProgress()`
- `public IModelState getParent()`
- `public com.google.common.base.Optional< TRSRTransformation > apply(com.google.common.base.Optional<? extends IModelPart > part)`
- `public TRSRTransformation getNodeMatrix( B3DModel.Node <?> node)`
- `public TRSRTransformation getNodeMatrix( B3DModel.Node <?> node, int frame)`
- `public static TRSRTransformation getNodeMatrix( B3DModel.Animation animation, B3DModel.Node <?> node, int frame)`
