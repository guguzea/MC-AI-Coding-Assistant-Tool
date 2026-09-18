# ClientRegistry

## Class signature

```java
public class ClientRegistry extends java.lang.Object
```

## Constructors

- `public ClientRegistry()`

## Methods

- `public static void registerTileEntity(java.lang.Class<? extends TileEntity > tileEntityClass, java.lang.String id, TileEntitySpecialRenderer specialRenderer)`
- `public static void bindTileEntitySpecialRenderer(java.lang.Class<? extends TileEntity > tileEntityClass, TileEntitySpecialRenderer specialRenderer)`
- `public static void registerKeyBinding( KeyBinding key)`

## Description

Utility method for registering a tile entity and it's renderer at once - generally you should register them separately