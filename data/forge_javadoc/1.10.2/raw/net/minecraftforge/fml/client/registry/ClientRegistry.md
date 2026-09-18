---
title: "ClientRegistry"
description: "Register a shader for an entity."
package: "net/minecraftforge/fml/client/registry"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/registry/ClientRegistry.html"
sourceType: javadoc
---

# ClientRegistry

## Class signature

```java
public class ClientRegistry extends java.lang.Object
```

## Constructors

- `public ClientRegistry()`

## Methods

- `public static <T extends TileEntity > void registerTileEntity(java.lang.Class<T> tileEntityClass, java.lang.String id, TileEntitySpecialRenderer <? super T> specialRenderer)`
- `public static <T extends TileEntity > void bindTileEntitySpecialRenderer(java.lang.Class<T> tileEntityClass, TileEntitySpecialRenderer <? super T> specialRenderer)`
- `public static void registerKeyBinding( KeyBinding key)`
- `public static void registerEntityShader(java.lang.Class<? extends Entity > entityClass, ResourceLocation shader)`
- `public static ResourceLocation getEntityShader(java.lang.Class<? extends Entity > entityClass)`

## Description

Register a shader for an entity.
