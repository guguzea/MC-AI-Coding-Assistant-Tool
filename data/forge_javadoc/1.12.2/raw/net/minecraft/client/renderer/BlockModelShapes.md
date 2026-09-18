---
title: "BlockModelShapes"
description: "public class BlockModelShapes extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/BlockModelShapes.html"
sourceType: javadoc
---

# BlockModelShapes

## Class signature

```java
public class BlockModelShapes extends java.lang.Object
```

## Constructors

- `public BlockModelShapes( ModelManager manager)`

## Methods

- `public BlockStateMapper getBlockStateMapper()`
- `public TextureAtlasSprite getTexture( IBlockState state)`
- `public IBakedModel getModelForState( IBlockState state)`
- `public ModelManager getModelManager()`
- `public void reloadModels()`
- `public void registerBlockWithStateMapper( Block assoc, IStateMapper stateMapper)`
- `public void registerBuiltInBlocks( Block ... builtIns)`
