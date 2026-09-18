# ISimpleBlockRenderingHandler

## Class signature

```java
public interface ISimpleBlockRenderingHandler
```

## Methods

- `void renderInventoryBlock( Block block, int metadata, int modelId, RenderBlocks renderer)`
- `boolean renderWorldBlock( IBlockAccess world, int x, int y, int z, Block block, int modelId, RenderBlocks renderer)`
- `boolean shouldRender3DInInventory(int modelId)`
- `int getRenderId()`