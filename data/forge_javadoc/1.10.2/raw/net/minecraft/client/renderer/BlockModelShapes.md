---
title: "BlockModelShapes"
description: "public class BlockModelShapes extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/BlockModelShapes.html"
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
