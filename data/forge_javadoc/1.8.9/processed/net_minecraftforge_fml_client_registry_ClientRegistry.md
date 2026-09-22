# ClientRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.registry.ClientRegistry

## Class signature

```java
public class ClientRegistry extends java.lang.Object
```

## Constructors

- `ClientRegistry()`

## Methods

- `static<T extends TileEntity> void bindTileEntitySpecialRenderer(java.lang.Class<T> tileEntityClass, TileEntitySpecialRenderer<? super T> specialRenderer)`
- `static ResourceLocation getEntityShader(java.lang.Class<? extends Entity> entityClass)`
- `static void registerEntityShader(java.lang.Class<? extends Entity> entityClass, ResourceLocation shader)` — Register a shader for an entity.
- `static void registerKeyBinding(KeyBinding key)`
- `static<T extends TileEntity> void registerTileEntity(java.lang.Class<T> tileEntityClass, java.lang.String id, TileEntitySpecialRenderer<? super T> specialRenderer)` — Utility method for registering a tile entity and it's renderer at once - generally you should register them separately