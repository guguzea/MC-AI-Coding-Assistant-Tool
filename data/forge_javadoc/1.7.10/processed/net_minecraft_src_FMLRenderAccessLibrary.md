# FMLRenderAccessLibrary

**Inheritance:** java.lang.Object → net.minecraft.src.FMLRenderAccessLibrary

## Class signature

```java
public class FMLRenderAccessLibrary extends java.lang.Object
```

## Constructors

- `FMLRenderAccessLibrary()`

## Methods

- `static Logger getLogger()`
- `static void log(Level level, java.lang.String message)`
- `static void log(Level level, java.lang.String message, java.lang.Throwable throwable)`
- `static void renderInventoryBlock(RenderBlocks renderer, Block block, int metadata, int modelID)`
- `static boolean renderItemAsFull3DBlock(int modelId)`
- `static boolean renderWorldBlock(RenderBlocks renderer, IBlockAccess world, int x, int y, int z, Block block, int modelId)`