# RenderingRegistry

## Class signature

```java
public class RenderingRegistry extends java.lang.Object
```

## Constructors

- `public RenderingRegistry()`

## Methods

- `public static int addNewArmourRendererPrefix(java.lang.String armor)`
- `public static void registerEntityRenderingHandler(java.lang.Class<? extends Entity > entityClass, Render renderer)`
- `public static void registerBlockHandler( ISimpleBlockRenderingHandler handler)`
- `public static void registerBlockHandler(int renderId, ISimpleBlockRenderingHandler handler)`
- `public static int getNextAvailableRenderId()`
- `@Deprecated public static RenderingRegistry instance()`
- `public boolean renderWorldBlock( RenderBlocks renderer, IBlockAccess world, int x, int y, int z, Block block, int modelId)`
- `public void renderInventoryBlock( RenderBlocks renderer, Block block, int metadata, int modelID)`
- `public boolean renderItemAsFull3DBlock(int modelId)`
- `public void loadEntityRenderers(java.util.Map<java.lang.Class<? extends Entity >, Render > rendererMap)`

## Description

Add a new armour prefix to the RenderPlayer