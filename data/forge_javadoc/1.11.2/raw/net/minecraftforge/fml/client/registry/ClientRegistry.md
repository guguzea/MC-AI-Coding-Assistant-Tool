---
title: "ClientRegistry"
description: "public class ClientRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/client/registry"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/registry/ClientRegistry.html"
sourceType: javadoc
---

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
