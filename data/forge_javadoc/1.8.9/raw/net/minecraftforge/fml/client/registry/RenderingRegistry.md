---
title: "RenderingRegistry"
description: "public class RenderingRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/client/registry"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/registry/RenderingRegistry.html"
sourceType: javadoc
---

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
