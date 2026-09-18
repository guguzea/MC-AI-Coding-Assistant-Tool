---
title: "TRSRTransformation"
description: "convert transformation from assuming center-block system to corner-block system"
package: "net/minecraftforge/client/model"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/TRSRTransformation.html"
sourceType: javadoc
---

# TRSRTransformation

## Class signature

```java
public class TRSRTransformation extends java.lang.Object implements IModelState , ITransformation
```

## Constructors

- `public TRSRTransformation(Matrix4f matrix)`
- `public TRSRTransformation(Vector3f translation, Quat4f leftRot, Vector3f scale, Quat4f rightRot)`

## Methods

- `public static Matrix4f getMatrix( ItemTransformVec3f transform)`
- `public static Matrix4f getMatrix( EnumFacing facing)`
- `public static TRSRTransformation identity()`
- `public TRSRTransformation compose( TRSRTransformation b)`
- `public static Quat4f quatFromYXZDegrees(Vector3f yxz)`
- `public static Quat4f quatFromYXZ(Vector3f yxz)`
- `public static Quat4f quatFromYXZ(float y, float x, float z)`
- `public static Vector3f toYXZDegrees(Quat4f q)`
- `public static Vector3f toYXZ(Quat4f q)`
- `public static Matrix4f mul(Vector3f translation, Quat4f leftRot, Vector3f scale, Quat4f rightRot)`
- `public static <any> svdDecompose(Matrix3f m)`
- `public static <any> toAffine(Matrix4f m)`
- `public ItemTransformVec3f toItemTransform()`
- `public Matrix4f getMatrix()`
- `public Vector3f getTranslation()`
- `public Quat4f getLeftRot()`
- `public Vector3f getScale()`
- `public Quat4f getRightRot()`
- `public <any> apply(<any> part)`
- `public EnumFacing rotate( EnumFacing facing)`
- `public static EnumFacing rotate(Matrix4f matrix, EnumFacing facing)`
- `public static boolean isInteger(Matrix4f matrix)`
- `public int rotate( EnumFacing facing, int vertexIndex)`
- `public java.lang.String toString()`
- `public static TRSRTransformation blockCenterToCorner( TRSRTransformation transform)`
- `public static TRSRTransformation blockCornerToCenter( TRSRTransformation transform)`
- `public int hashCode()`
- `public boolean equals(java.lang.Object obj)`
- `public static Vector3f toVecmath(org.lwjgl.util.vector.Vector3f vec)`
- `public static Vector4f toVecmath(org.lwjgl.util.vector.Vector4f vec)`
- `public static Matrix4f toVecmath(org.lwjgl.util.vector.Matrix4f m)`
- `public static org.lwjgl.util.vector.Vector3f toLwjgl(Vector3f vec)`
- `public static org.lwjgl.util.vector.Vector4f toLwjgl(Vector4f vec)`
- `public static org.lwjgl.util.vector.Matrix4f toLwjgl(Matrix4f m)`
- `public static Vector3f lerp(Tuple3f from, Tuple3f to, float progress)`
- `public static Vector4f lerp(Tuple4f from, Tuple4f to, float progress)`
- `public static Quat4f slerp(Quat4f from, Quat4f to, float progress)`
- `public TRSRTransformation slerp( TRSRTransformation that, float progress)`

## Description

convert transformation from assuming center-block system to corner-block system
