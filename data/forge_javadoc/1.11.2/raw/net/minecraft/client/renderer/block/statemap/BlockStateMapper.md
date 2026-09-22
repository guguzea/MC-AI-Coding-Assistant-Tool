---
title: "BlockStateMapper"
description: "public class BlockStateMapper extends java.lang.Object"
package: "net/minecraft/client/renderer/block/statemap"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/block/statemap/BlockStateMapper.html"
sourceType: javadoc
---

# BlockStateMapper

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.statemap.BlockStateMapper

## Class signature

```java
public class BlockStateMapper extends java.lang.Object
```

## Constructors

- `BlockStateMapper()`

## Methods

- `java.util.Set<ResourceLocation> getBlockstateLocations(Block blockIn)`
- `java.util.Map<IBlockState, ModelResourceLocation> getVariants(Block blockIn)`
- `java.util.Map<IBlockState, ModelResourceLocation> putAllStateModelLocations()`
- `void registerBlockStateMapper(Block blockIn, IStateMapper stateMapper)`
- `void registerBuiltInBlocks(Block ... blockIn)`
