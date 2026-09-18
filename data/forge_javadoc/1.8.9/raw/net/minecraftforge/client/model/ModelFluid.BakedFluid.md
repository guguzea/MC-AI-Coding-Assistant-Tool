---
title: "ModelFluid.BakedFluid"
description: ""
package: "net/minecraftforge/client/model"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ModelFluid.BakedFluid.html"
sourceType: javadoc
---

# ModelFluid.BakedFluid

## Constructors

- `public BakedFluid(<any> transformation, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas)`
- `public BakedFluid(<any> transformation, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas, <any> stateOption)`
- `public BakedFluid(<any> transformation, <any> transforms, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas, <any> stateOption)`
- `public BakedFluid(<any> transformation, <any> transforms, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas, boolean statePresent, int[] cornerRound, int flowRound)`

## Methods

- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public java.util.List< BakedQuad > getFaceQuads( EnumFacing side)`
- `public java.util.List< BakedQuad > getGeneralQuads()`
- `public VertexFormat getFormat()`
- `public IBakedModel handleBlockState( IBlockState state)`
- `public <any> handlePerspective( ItemCameraTransforms.TransformType type)`
