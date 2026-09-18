# TRSRTransformation

## Class signature

```java
public final class TRSRTransformation extends java.lang.Object implements IModelState , ITransformation
```

## Constructors

- `public TRSRTransformation(javax.vecmath.Matrix4f matrix)`
- `public TRSRTransformation(@Nullable javax.vecmath.Vector3f translation, @Nullable javax.vecmath.Quat4f leftRot, @Nullable javax.vecmath.Vector3f scale, @Nullable javax.vecmath.Quat4f rightRot)`
- `public TRSRTransformation( ModelRotation rotation)`
- `public TRSRTransformation( EnumFacing facing)`

## Methods

- `@Deprecated public TRSRTransformation( ItemTransformVec3f transform)`
- `public static javax.vecmath.Matrix4f getMatrix( EnumFacing facing)`
- `public static TRSRTransformation identity()`
- `public TRSRTransformation compose( TRSRTransformation b)`
- `public TRSRTransformation inverse()`
- `public static javax.vecmath.Quat4f quatFromYXZ(float y, float x, float z)`
- `public static javax.vecmath.Quat4f quatFromXYZDegrees(javax.vecmath.Vector3f xyz)`
- `public static javax.vecmath.Quat4f quatFromXYZ(javax.vecmath.Vector3f xyz)`
- `public static javax.vecmath.Quat4f quatFromXYZ(float x, float y, float z)`
- `public static javax.vecmath.Vector3f toYXZDegrees(javax.vecmath.Quat4f q)`
- `public static javax.vecmath.Vector3f toYXZ(javax.vecmath.Quat4f q)`
- `public static javax.vecmath.Vector3f toXYZDegrees(javax.vecmath.Quat4f q)`
- `public static javax.vecmath.Vector3f toXYZ(javax.vecmath.Quat4f q)`
- `public static javax.vecmath.Matrix4f mul(@Nullable javax.vecmath.Vector3f translation, @Nullable javax.vecmath.Quat4f leftRot, @Nullable javax.vecmath.Vector3f scale, @Nullable javax.vecmath.Quat4f rightRot)`
- `public static org.apache.commons.lang3.tuple.Triple<javax.vecmath.Quat4f,javax.vecmath.Vector3f,javax.vecmath.Quat4f> svdDecompose(javax.vecmath.Matrix3f m)`
- `public static org.apache.commons.lang3.tuple.Pair<javax.vecmath.Matrix3f,javax.vecmath.Vector3f> toAffine(javax.vecmath.Matrix4f m)`
- `@Deprecated public ItemTransformVec3f toItemTransform()`
- `public javax.vecmath.Matrix4f getMatrix()`
- `public javax.vecmath.Vector3f getTranslation()`
- `public javax.vecmath.Quat4f getLeftRot()`
- `public javax.vecmath.Vector3f getScale()`
- `public javax.vecmath.Quat4f getRightRot()`
- `public com.google.common.base.Optional< TRSRTransformation > apply(com.google.common.base.Optional<? extends IModelPart > part)`
- `public EnumFacing rotate( EnumFacing facing)`
- `public static EnumFacing rotate(javax.vecmath.Matrix4f matrix, EnumFacing facing)`
- `public static boolean isInteger(javax.vecmath.Matrix4f matrix)`
- `public int rotate( EnumFacing facing, int vertexIndex)`
- `public java.lang.String toString()`
- `public static TRSRTransformation blockCenterToCorner( TRSRTransformation transform)`
- `public static TRSRTransformation blockCornerToCenter( TRSRTransformation transform)`
- `public int hashCode()`
- `public boolean equals(java.lang.Object obj)`
- `public static javax.vecmath.Vector3f toVecmath(org.lwjgl.util.vector.Vector3f vec)`
- `public static javax.vecmath.Vector4f toVecmath(org.lwjgl.util.vector.Vector4f vec)`
- `public static javax.vecmath.Matrix4f toVecmath(org.lwjgl.util.vector.Matrix4f m)`
- `public static org.lwjgl.util.vector.Vector3f toLwjgl(javax.vecmath.Vector3f vec)`
- `public static org.lwjgl.util.vector.Vector4f toLwjgl(javax.vecmath.Vector4f vec)`
- `public static org.lwjgl.util.vector.Matrix4f toLwjgl(javax.vecmath.Matrix4f m)`
- `public static javax.vecmath.Vector3f lerp(javax.vecmath.Tuple3f from, javax.vecmath.Tuple3f to, float progress)`
- `public static javax.vecmath.Vector4f lerp(javax.vecmath.Tuple4f from, javax.vecmath.Tuple4f to, float progress)`
- `public static javax.vecmath.Quat4f slerp(javax.vecmath.Quat4f from, javax.vecmath.Quat4f to, float progress)`
- `public TRSRTransformation slerp( TRSRTransformation that, float progress)`
- `public static TRSRTransformation getVanillaUvTransformLocalToGlobal( EnumFacing side)`
- `public static TRSRTransformation getVanillaUvTransformGlobalToLocal( EnumFacing side)`
- `public TRSRTransformation getUVLockTransform( EnumFacing originalSide)`

## Description

Deprecated.