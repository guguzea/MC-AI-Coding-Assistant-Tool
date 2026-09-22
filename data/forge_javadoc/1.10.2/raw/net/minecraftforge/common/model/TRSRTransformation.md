---
title: "TRSRTransformation"
description: "public final class TRSRTransformation extends java.lang.Object implements IModelState, ITransformation"
package: "net/minecraftforge/common/model"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/model/TRSRTransformation.html"
sourceType: javadoc
---

# TRSRTransformation

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.TRSRTransformation

## Class signature

```java
public final class TRSRTransformation extends java.lang.Object implements IModelState, ITransformation
```

## Constructors

- `TRSRTransformation(EnumFacing facing)`
- `@Deprecated TRSRTransformation(ItemTransformVec3f transform)`
- `TRSRTransformation(javax.vecmath.Matrix4f matrix)`
- `TRSRTransformation(ModelRotation rotation)`
- `TRSRTransformation(javax.vecmath.Vector3f translation, javax.vecmath.Quat4f leftRot, javax.vecmath.Vector3f scale, javax.vecmath.Quat4f rightRot)`

## Methods

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`
- `static TRSRTransformation blockCenterToCorner(TRSRTransformation transform)` — convert transformation from assuming center-block system to corner-block system
- `static TRSRTransformation blockCornerToCenter(TRSRTransformation transform)` — convert transformation from assuming corner-block system to center-block system
- `TRSRTransformation compose(TRSRTransformation b)`
- `boolean equals(java.lang.Object obj)`
- `javax.vecmath.Quat4f getLeftRot()`
- `javax.vecmath.Matrix4f getMatrix()`
- `static javax.vecmath.Matrix4f getMatrix(EnumFacing facing)`
- `javax.vecmath.Quat4f getRightRot()`
- `javax.vecmath.Vector3f getScale()`
- `javax.vecmath.Vector3f getTranslation()`
- `TRSRTransformation getUVLockTransform(EnumFacing originalSide)`
- `static TRSRTransformation getVanillaUvTransformGlobalToLocal(EnumFacing side)`
- `static TRSRTransformation getVanillaUvTransformLocalToGlobal(EnumFacing side)`
- `int hashCode()`
- `static TRSRTransformation identity()`
- `TRSRTransformation inverse()`
- `static boolean isInteger(javax.vecmath.Matrix4f matrix)`
- `static javax.vecmath.Vector3f lerp(javax.vecmath.Tuple3f from, javax.vecmath.Tuple3f to, float progress)`
- `static javax.vecmath.Vector4f lerp(javax.vecmath.Tuple4f from, javax.vecmath.Tuple4f to, float progress)`
- `static javax.vecmath.Matrix4f mul(javax.vecmath.Vector3f translation, javax.vecmath.Quat4f leftRot, javax.vecmath.Vector3f scale, javax.vecmath.Quat4f rightRot)`
- `static javax.vecmath.Quat4f quatFromXYZ(float x, float y, float z)`
- `static javax.vecmath.Quat4f quatFromXYZ(javax.vecmath.Vector3f xyz)`
- `static javax.vecmath.Quat4f quatFromXYZDegrees(javax.vecmath.Vector3f xyz)`
- `static javax.vecmath.Quat4f quatFromYXZ(float y, float x, float z)`
- `EnumFacing rotate(EnumFacing facing)`
- `int rotate(EnumFacing facing, int vertexIndex)`
- `static EnumFacing rotate(javax.vecmath.Matrix4f matrix, EnumFacing facing)`
- `static javax.vecmath.Quat4f slerp(javax.vecmath.Quat4f from, javax.vecmath.Quat4f to, float progress)`
- `TRSRTransformation slerp(TRSRTransformation that, float progress)`
- `static org.apache.commons.lang3.tuple.Triple<javax.vecmath.Quat4f, javax.vecmath.Vector3f, javax.vecmath.Quat4f> svdDecompose(javax.vecmath.Matrix3f m)`
- `static org.apache.commons.lang3.tuple.Pair<javax.vecmath.Matrix3f, javax.vecmath.Vector3f> toAffine(javax.vecmath.Matrix4f m)`
- `@Deprecated ItemTransformVec3f toItemTransform()`
- `static org.lwjgl.util.vector.Matrix4f toLwjgl(javax.vecmath.Matrix4f m)`
- `static org.lwjgl.util.vector.Vector3f toLwjgl(javax.vecmath.Vector3f vec)`
- `static org.lwjgl.util.vector.Vector4f toLwjgl(javax.vecmath.Vector4f vec)`
- `java.lang.String toString()`
- `static javax.vecmath.Matrix4f toVecmath(org.lwjgl.util.vector.Matrix4f m)`
- `static javax.vecmath.Vector3f toVecmath(org.lwjgl.util.vector.Vector3f vec)`
- `static javax.vecmath.Vector4f toVecmath(org.lwjgl.util.vector.Vector4f vec)`
- `static javax.vecmath.Vector3f toXYZ(javax.vecmath.Quat4f q)`
- `static javax.vecmath.Vector3f toXYZDegrees(javax.vecmath.Quat4f q)`
- `static javax.vecmath.Vector3f toYXZ(javax.vecmath.Quat4f q)`
- `static javax.vecmath.Vector3f toYXZDegrees(javax.vecmath.Quat4f q)`
