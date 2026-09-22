---
title: "IModel"
description: "public interface IModel"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/IModel.html"
sourceType: javadoc
---

# IModel

## Class signature

```java
public interface IModel
```

## Methods

- `default java.util.Optional<ModelBlock> asVanillaModel()`
- `IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `default java.util.Optional<? extends IClip> getClip(java.lang.String name)`
- `default IModelState getDefaultState()`
- `default java.util.Collection<ResourceLocation> getDependencies()`
- `default java.util.Collection<ResourceLocation> getTextures()`
- `default IModel gui3d(boolean value)`
- `default IModel process(<any> customData)` — Allows the model to process custom data from the variant definition.
- `default IModel retexture(<any> textures)` — Applies new textures to the model.
- `default IModel smoothLighting(boolean value)`
- `default IModel uvlock(boolean value)`
