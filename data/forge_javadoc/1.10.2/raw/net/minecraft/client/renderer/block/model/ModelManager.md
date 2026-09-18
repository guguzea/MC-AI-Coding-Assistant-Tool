---
title: "ModelManager"
description: "public class ModelManager extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer/block/model"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/block/model/ModelManager.html"
sourceType: javadoc
---

# ModelManager

## Class signature

```java
public class ModelManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public ModelManager( TextureMap textures)`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public IBakedModel getModel( ModelResourceLocation modelLocation)`
- `public IBakedModel getMissingModel()`
- `public TextureMap getTextureMap()`
- `public BlockModelShapes getBlockModelShapes()`
