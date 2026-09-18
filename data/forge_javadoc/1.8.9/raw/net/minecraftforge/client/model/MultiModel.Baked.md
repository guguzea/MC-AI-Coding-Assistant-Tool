---
title: "MultiModel.Baked"
description: ""
package: "net/minecraftforge/client/model"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/MultiModel.Baked.html"
sourceType: javadoc
---

# MultiModel.Baked

## Constructors

- `public Baked( IFlexibleBakedModel base, <any> parts)`
- `public Baked( ResourceLocation location, boolean perspective, IFlexibleBakedModel base, <any> parts)`

## Methods

- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public java.util.List< BakedQuad > getFaceQuads( EnumFacing side)`
- `public java.util.List< BakedQuad > getGeneralQuads()`
- `public VertexFormat getFormat()`
- `public IFlexibleBakedModel getBaseModel()`
- `public java.util.Map<java.lang.String, IFlexibleBakedModel > getParts()`
- `public <any> handlePerspective( ItemCameraTransforms.TransformType cameraTransformType)`
