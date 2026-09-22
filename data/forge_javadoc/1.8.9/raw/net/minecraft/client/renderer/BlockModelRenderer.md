---
title: "BlockModelRenderer"
description: "public class BlockModelRenderer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/BlockModelRenderer.html"
sourceType: javadoc
---

# BlockModelRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BlockModelRenderer

## Class signature

```java
public class BlockModelRenderer extends java.lang.Object
```

## Constructors

- `BlockModelRenderer()`

## Methods

- `boolean renderModel(IBlockAccess blockAccessIn, IBakedModel modelIn, IBlockState blockStateIn, BlockPos blockPosIn, WorldRenderer worldRendererIn)`
- `boolean renderModel(IBlockAccess blockAccessIn, IBakedModel modelIn, IBlockState blockStateIn, BlockPos blockPosIn, WorldRenderer worldRendererIn, boolean checkSides)`
- `boolean renderModelAmbientOcclusion(IBlockAccess blockAccessIn, IBakedModel modelIn, Block blockIn, BlockPos blockPosIn, WorldRenderer worldRendererIn, boolean checkSides)`
- `void renderModelBrightness(IBakedModel model, IBlockState p_178266_2_, float brightness, boolean p_178266_4_)`
- `void renderModelBrightnessColor(IBakedModel bakedModel, float p_178262_2_, float red, float green, float blue)`
- `boolean renderModelStandard(IBlockAccess blockAccessIn, IBakedModel modelIn, Block blockIn, BlockPos blockPosIn, WorldRenderer worldRendererIn, boolean checkSides)`
