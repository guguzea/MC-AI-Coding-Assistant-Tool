# ClientRegistry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.registry.ClientRegistry

## Class signature

```java
public class ClientRegistry extends java.lang.Object
```

## Constructors

- `ClientRegistry()`

## Methods

- `static void bindTileEntitySpecialRenderer(java.lang.Class<? extends TileEntity> tileEntityClass, TileEntitySpecialRenderer specialRenderer)`
- `static void registerKeyBinding(KeyBinding key)`
- `static void registerTileEntity(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id, TileEntitySpecialRenderer specialRenderer)` — Utility method for registering a tile entity and it's renderer at once - generally you should register them separately