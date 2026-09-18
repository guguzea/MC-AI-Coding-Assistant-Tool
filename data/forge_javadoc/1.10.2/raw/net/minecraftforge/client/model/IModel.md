---
title: "IModel"
description: "public interface IModel"
package: "net/minecraftforge/client/model"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/IModel.html"
sourceType: javadoc
---

# IModel

## Class signature

```java
public interface IModel
```

## Methods

- `java.util.Collection< ResourceLocation > getDependencies()`
- `java.util.Collection< ResourceLocation > getTextures()`
- `IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `IModelState getDefaultState()`
