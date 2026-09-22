---
title: "TRSRTransformation"
description: "public final class TRSRTransformation extends java.lang.Object implements IModelState, ITransformation"
package: "net/minecraftforge/common/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/model/TRSRTransformation.html"
sourceType: javadoc
---

# TRSRTransformation

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.TRSRTransformation

## Class signature

```java
public final class TRSRTransformation extends java.lang.Object implements IModelState, ITransformation
```

## Constructors

- `TRSRTransformation(Matrix4f matrix)`
- `TRSRTransformation(Vector3f translation, Quat4f leftRot, Vector3f scale, Quat4f rightRot)`

## Methods

- `java.util.Optional<TRSRTransformation> apply(java.util.Optional<? extends IModelPart> part)`
- `static TRSRTransformation blockCenterToCorner(TRSRTransformation transform)` — convert transformation from assuming center-block system to corner-block system
- `static TRSRTransformation blockCornerToCenter(TRSRTransformation transform)` — convert transformation from assuming corner-block system to center-block system
- `TRSRTransformation compose(TRSRTransformation b)`
- `boolean equals(java.lang.Object obj)`
- `static TRSRTransformation from(EnumFacing facing)`
- `@Deprecated static TRSRTransformation from(ItemTransformVec3f transform)`
- `static TRSRTransformation from(ModelRotation rotation)`
- `Quat4f getLeftRot()`
- `Matrix4f getMatrix()`
- `static Matrix4f getMatrix(EnumFacing facing)`
- `Quat4f getRightRot()`
- `static ModelRotation getRotation(EnumFacing facing)`
- `Vector3f getScale()`
- `Vector3f getTranslation()`
- `TRSRTransformation getUVLockTransform(EnumFacing originalSide)`
- `static TRSRTransformation getVanillaUvTransformGlobalToLocal(EnumFacing side)`
- `static TRSRTransformation getVanillaUvTransformLocalToGlobal(EnumFacing side)`
- `int hashCode()`
- `static TRSRTransformation identity()`
- `TRSRTransformation inverse()`
- `boolean isIdentity()`
- `static boolean isInteger(Matrix4f matrix)`
- `static Vector3f lerp(Tuple3f from, Tuple3f to, float progress)`
- `static Vector4f lerp(Tuple4f from, Tuple4f to, float progress)`
- `static Matrix4f mul(Vector3f translation, Quat4f leftRot, Vector3f scale, Quat4f rightRot)`
- `static Quat4f quatFromXYZ(float x, float y, float z)`
- `static Quat4f quatFromXYZ(Vector3f xyz)`
- `static Quat4f quatFromXYZDegrees(Vector3f xyz)`
- `static Quat4f quatFromYXZ(float y, float x, float z)`
- `EnumFacing rotate(EnumFacing facing)`
- `int rotate(EnumFacing facing, int vertexIndex)`
- `static EnumFacing rotate(Matrix4f matrix, EnumFacing facing)`
- `static Quat4f slerp(Quat4f from, Quat4f to, float progress)`
- `TRSRTransformation slerp(TRSRTransformation that, float progress)`
- `static<any> svdDecompose(Matrix3f m)`
- `static<any> toAffine(Matrix4f m)`
- `@Deprecated ItemTransformVec3f toItemTransform()`
- `static org.lwjgl.util.vector.Matrix4f toLwjgl(Matrix4f m)`
- `static org.lwjgl.util.vector.Vector3f toLwjgl(Vector3f vec)`
- `static org.lwjgl.util.vector.Vector4f toLwjgl(Vector4f vec)`
- `java.lang.String toString()`
- `static Matrix4f toVecmath(org.lwjgl.util.vector.Matrix4f m)`
- `static Vector3f toVecmath(org.lwjgl.util.vector.Vector3f vec)`
- `static Vector4f toVecmath(org.lwjgl.util.vector.Vector4f vec)`
- `static Vector3f toXYZ(Quat4f q)`
- `static Vector3f toXYZDegrees(Quat4f q)`
- `static Vector3f toYXZ(Quat4f q)`
- `static Vector3f toYXZDegrees(Quat4f q)`
- `void transformNormal(Vector3f normal)`
- `void transformPosition(Vector4f position)`
