---
title: "BlockStateMapper"
description: "public class BlockStateMapper extends java.lang.Object"
package: "net/minecraft/client/renderer/block/statemap"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/block/statemap/BlockStateMapper.html"
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
