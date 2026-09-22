---
title: "ModelRotation"
description: "public enum ModelRotation extends java.lang.Enum<ModelRotation> implements IModelState, ITransformation"
package: "net/minecraft/client/resources/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/model/ModelRotation.html"
sourceType: javadoc
---

# ModelRotation

**Inheritance:** java.lang.Object → java.lang.Enum<ModelRotation> → net.minecraft.client.resources.model.ModelRotation

## Class signature

```java
public enum ModelRotation extends java.lang.Enum<ModelRotation> implements IModelState, ITransformation
```

## Methods

- `<any> apply(<any> part)`
- `javax.vecmath.Matrix4f getMatrix()`
- `Matrix4f getMatrix4d()`
- `static ModelRotation getModelRotation(int p_177524_0_, int p_177524_1_)`
- `EnumFacing rotate(EnumFacing facing)`
- `int rotate(EnumFacing facing, int vertexIndex)`
- `EnumFacing rotateFace(EnumFacing p_177523_1_)`
- `int rotateVertex(EnumFacing facing, int vertexIndex)`
- `static ModelRotation valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static ModelRotation [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
