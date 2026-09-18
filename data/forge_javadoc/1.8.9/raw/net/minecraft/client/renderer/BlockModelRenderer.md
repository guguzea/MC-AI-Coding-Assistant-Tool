---
title: "BlockModelRenderer"
description: "public class BlockModelRenderer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/BlockModelRenderer.html"
sourceType: javadoc
---

# BlockModelRenderer

## Class signature

```java
public class BlockModelRenderer extends java.lang.Object
```

## Constructors

- `public BlockModelRenderer()`

## Methods

- `public boolean renderModel( IBlockAccess blockAccessIn, IBakedModel modelIn, IBlockState blockStateIn, BlockPos blockPosIn, WorldRenderer worldRendererIn)`
- `public boolean renderModel( IBlockAccess blockAccessIn, IBakedModel modelIn, IBlockState blockStateIn, BlockPos blockPosIn, WorldRenderer worldRendererIn, boolean checkSides)`
- `public boolean renderModelAmbientOcclusion( IBlockAccess blockAccessIn, IBakedModel modelIn, Block blockIn, BlockPos blockPosIn, WorldRenderer worldRendererIn, boolean checkSides)`
- `public boolean renderModelStandard( IBlockAccess blockAccessIn, IBakedModel modelIn, Block blockIn, BlockPos blockPosIn, WorldRenderer worldRendererIn, boolean checkSides)`
- `public void renderModelBrightnessColor( IBakedModel bakedModel, float p_178262_2_, float red, float green, float blue)`
- `public void renderModelBrightness( IBakedModel model, IBlockState p_178266_2_, float brightness, boolean p_178266_4_)`
