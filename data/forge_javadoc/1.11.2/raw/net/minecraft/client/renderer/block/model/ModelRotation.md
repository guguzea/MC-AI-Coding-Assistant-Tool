---
title: "ModelRotation"
description: "public enum ModelRotation extends java.lang.Enum<ModelRotation> implements IModelState, ITransformation"
package: "net/minecraft/client/renderer/block/model"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/block/model/ModelRotation.html"
sourceType: javadoc
---

# ModelRotation

**Inheritance:** java.lang.Object → java.lang.Enum<ModelRotation> → net.minecraft.client.renderer.block.model.ModelRotation

## Class signature

```java
public enum ModelRotation extends java.lang.Enum<ModelRotation> implements IModelState, ITransformation
```

## Methods

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`
- `javax.vecmath.Matrix4f getMatrix()`
- `org.lwjgl.util.vector.Matrix4f getMatrix4d()`
- `static ModelRotation getModelRotation(int x, int y)`
- `EnumFacing rotate(EnumFacing facing)`
- `int rotate(EnumFacing facing, int vertexIndex)`
- `EnumFacing rotateFace(EnumFacing facing)`
- `int rotateVertex(EnumFacing facing, int vertexIndex)`
- `static ModelRotation valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static ModelRotation [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
