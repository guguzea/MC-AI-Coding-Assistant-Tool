---
title: "ItemModelMesher"
description: "public class ItemModelMesher extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/ItemModelMesher.html"
sourceType: javadoc
---

# ItemModelMesher

## Class signature

```java
public class ItemModelMesher extends java.lang.Object
```

## Constructors

- `public ItemModelMesher( ModelManager modelManager)`

## Methods

- `public TextureAtlasSprite getParticleIcon( Item item)`
- `public TextureAtlasSprite getParticleIcon( Item item, int meta)`
- `public IBakedModel getItemModel( ItemStack stack)`
- `protected int getMetadata( ItemStack stack)`
- `@Nullable protected IBakedModel getItemModel( Item item, int meta)`
- `public void register( Item item, int meta, ModelResourceLocation location)`
- `public void register( Item item, ItemMeshDefinition definition)`
- `public ModelManager getModelManager()`
- `public void rebuildCache()`
