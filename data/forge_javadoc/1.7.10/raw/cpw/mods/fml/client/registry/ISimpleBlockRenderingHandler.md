---
title: "ISimpleBlockRenderingHandler"
description: "public interface ISimpleBlockRenderingHandler"
package: "cpw/mods/fml/client/registry"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/registry/ISimpleBlockRenderingHandler.html"
sourceType: javadoc
---

# ISimpleBlockRenderingHandler

## Class signature

```java
public interface ISimpleBlockRenderingHandler
```

## Methods

- `int getRenderId()`
- `void renderInventoryBlock(Block block, int metadata, int modelId, RenderBlocks renderer)`
- `boolean renderWorldBlock(IBlockAccess world, int x, int y, int z, Block block, int modelId, RenderBlocks renderer)`
- `boolean shouldRender3DInInventory(int modelId)`
