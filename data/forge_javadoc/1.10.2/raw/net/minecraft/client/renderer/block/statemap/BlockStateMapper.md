---
title: "BlockStateMapper"
description: "public class BlockStateMapper extends java.lang.Object"
package: "net/minecraft/client/renderer/block/statemap"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/block/statemap/BlockStateMapper.html"
sourceType: javadoc
---

# BlockStateMapper

## Class signature

```java
public class BlockStateMapper extends java.lang.Object
```

## Constructors

- `public BlockStateMapper()`

## Methods

- `public void registerBlockStateMapper( Block blockIn, IStateMapper stateMapper)`
- `public void registerBuiltInBlocks( Block ... blockIn)`
- `public java.util.Map< IBlockState , ModelResourceLocation > putAllStateModelLocations()`
- `public java.util.Set< ResourceLocation > getBlockstateLocations( Block blockIn)`
- `public java.util.Map< IBlockState , ModelResourceLocation > getVariants( Block blockIn)`
