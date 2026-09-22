# RenderingRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.registry.RenderingRegistry

## Class signature

```java
public class RenderingRegistry extends java.lang.Object
```

## Constructors

- `RenderingRegistry()`

## Methods

- `static void loadEntityRenderers(java.util.Map<java.lang.Class<? extends Entity>, Render<? extends Entity>> entityRenderMap)`
- `static void loadEntityRenderers(RenderManager manager, java.util.Map<java.lang.Class<? extends Entity>, Render<? extends Entity>> renderMap)`
- `@Deprecated static void registerEntityRenderingHandler(java.lang.Class<? extends Entity> entityClass, Render<? extends Entity> renderer)` — Deprecated. use the factory version during Preinitialization. Will be removed in 1.9.
- `static<T extends Entity> void registerEntityRenderingHandler(java.lang.Class<T> entityClass, IRenderFactory<? super T> renderFactory)` — Register an entity rendering handler.