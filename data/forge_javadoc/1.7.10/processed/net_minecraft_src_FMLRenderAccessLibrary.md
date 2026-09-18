# FMLRenderAccessLibrary

## Class signature

```java
public class FMLRenderAccessLibrary extends java.lang.Object
```

## Constructors

- `public FMLRenderAccessLibrary()`

## Methods

- `public static Logger getLogger()`
- `public static void log(Level level, java.lang.String message)`
- `public static void log(Level level, java.lang.String message, java.lang.Throwable throwable)`
- `public static boolean renderWorldBlock( RenderBlocks renderer, IBlockAccess world, int x, int y, int z, Block block, int modelId)`
- `public static void renderInventoryBlock( RenderBlocks renderer, Block block, int metadata, int modelID)`
- `public static boolean renderItemAsFull3DBlock(int modelId)`

## Description

A static hook library for optifine and other basemod editing code to access FML functions