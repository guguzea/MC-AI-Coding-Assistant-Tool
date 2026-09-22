---
title: "ItemModelMesher"
description: "public class ItemModelMesher extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/ItemModelMesher.html"
sourceType: javadoc
---

# ItemModelMesher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.ItemModelMesher

## Class signature

```java
public class ItemModelMesher extends java.lang.Object
```

## Constructors

- `ItemModelMesher(ModelManager modelManager)`

## Methods

- `protected IBakedModel getItemModel(Item item, int meta)`
- `IBakedModel getItemModel(ItemStack stack)`
- `protected int getMetadata(ItemStack stack)`
- `ModelManager getModelManager()`
- `TextureAtlasSprite getParticleIcon(Item item)`
- `TextureAtlasSprite getParticleIcon(Item item, int meta)`
- `void rebuildCache()`
- `void register(Item item, int meta, ModelResourceLocation location)`
- `void register(Item item, ItemMeshDefinition definition)`
