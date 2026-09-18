---
title: "ModelRotation"
description: "Returns the enum constant of this type with the specified name."
package: "net/minecraft/client/renderer/block/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/block/model/ModelRotation.html"
sourceType: javadoc
---

# ModelRotation

## Class signature

```java
public enum ModelRotation extends java.lang.Enum< ModelRotation > implements IModelState , ITransformation
```

## Methods

- `public static ModelRotation [] values()`
- `public static ModelRotation valueOf(java.lang.String name)`
- `public Matrix4f getMatrix4d()`
- `public EnumFacing rotateFace( EnumFacing facing)`
- `public int rotateVertex( EnumFacing facing, int vertexIndex)`
- `public static ModelRotation getModelRotation(int x, int y)`
- `public java.util.Optional< TRSRTransformation > apply(java.util.Optional<? extends IModelPart > part)`
- `public javax.vecmath.Matrix4f getMatrix()`
- `public EnumFacing rotate( EnumFacing facing)`
- `public int rotate( EnumFacing facing, int vertexIndex)`

## Description

Returns the enum constant of this type with the specified name.
