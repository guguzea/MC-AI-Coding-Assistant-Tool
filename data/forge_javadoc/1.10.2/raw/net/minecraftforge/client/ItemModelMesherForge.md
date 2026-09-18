---
title: "ItemModelMesherForge"
description: "Wrapper around ItemModeMesher that cleans up the internal maps to respect ID remapping."
package: "net/minecraftforge/client"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/ItemModelMesherForge.html"
sourceType: javadoc
---

# ItemModelMesherForge

## Class signature

```java
public class ItemModelMesherForge extends ItemModelMesher
```

## Constructors

- `public ItemModelMesherForge( ModelManager manager)`

## Methods

- `protected IBakedModel getItemModel( Item item, int meta)`
- `public void register( Item item, int meta, ModelResourceLocation location)`
- `public void rebuildCache()`

## Description

Wrapper around ItemModeMesher that cleans up the internal maps to respect ID remapping.
