---
title: "IPerspectiveAwareModel.MapWrapper"
description: ""
package: "net/minecraftforge/client/model"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/IPerspectiveAwareModel.MapWrapper.html"
sourceType: javadoc
---

# IPerspectiveAwareModel.MapWrapper

## Constructors

- `public MapWrapper( IBakedModel parent, com.google.common.collect.ImmutableMap< ItemCameraTransforms.TransformType , TRSRTransformation > transforms)`
- `public MapWrapper( IBakedModel parent, IModelState state)`

## Methods

- `public static com.google.common.collect.ImmutableMap< ItemCameraTransforms.TransformType , TRSRTransformation > getTransforms( IModelState state)`
- `public static com.google.common.collect.ImmutableMap< ItemCameraTransforms.TransformType , TRSRTransformation > getTransforms( ItemCameraTransforms transforms)`
- `public static org.apache.commons.lang3.tuple.Pair<? extends IBakedModel ,javax.vecmath.Matrix4f> handlePerspective( IBakedModel model, com.google.common.collect.ImmutableMap< ItemCameraTransforms.TransformType , TRSRTransformation > transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `public static org.apache.commons.lang3.tuple.Pair<? extends IBakedModel ,javax.vecmath.Matrix4f> handlePerspective( IBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public java.util.List< BakedQuad > getQuads( IBlockState state, EnumFacing side, long rand)`
- `public ItemOverrideList getOverrides()`
- `public org.apache.commons.lang3.tuple.Pair<? extends IBakedModel ,javax.vecmath.Matrix4f> handlePerspective( ItemCameraTransforms.TransformType cameraTransformType)`
