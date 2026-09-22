---
title: "ModelBakery"
description: "public class ModelBakery extends java.lang.Object"
package: "net/minecraft/client/resources/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/model/ModelBakery.html"
sourceType: javadoc
---

# ModelBakery

**Inheritance:** java.lang.Object → net.minecraft.client.resources.model.ModelBakery

## Class signature

```java
public class ModelBakery extends java.lang.Object
```

## Constructors

- `ModelBakery(IResourceManager p_i46085_1_, TextureMap p_i46085_2_, BlockModelShapes p_i46085_3_)`

## Methods

- `@Deprecated static void addVariantName(Item item, java.lang.String... names)` — Deprecated. use registerItemVariants
- `protected IBakedModel bakeModel(ModelBlock modelBlockIn, ITransformation modelRotationIn, boolean uvLocked)`
- `protected ResourceLocation getItemLocation(java.lang.String p_177583_1_)`
- `protected ModelBlockDefinition getModelBlockDefinition(ResourceLocation p_177586_1_)`
- `protected ResourceLocation getModelLocation(ResourceLocation p_177580_1_)`
- `protected java.util.Set<ResourceLocation> getTextureLocations(ModelBlock p_177585_1_)`
- `protected java.util.List<java.lang.String> getVariantNames(Item p_177596_1_)`
- `protected boolean hasItemModel(ModelBlock p_177581_1_)`
- `protected boolean isCustomRenderer(ModelBlock p_177587_1_)`
- `protected ModelBlock loadModel(ResourceLocation p_177594_1_)`
- `protected void loadVariants(java.util.Collection<ModelResourceLocation> p_177591_1_)`
- `protected BakedQuad makeBakedQuad(BlockPart p_177589_1_, BlockPartFace p_177589_2_, TextureAtlasSprite p_177589_3_, EnumFacing p_177589_4_, ITransformation p_177589_5_, boolean p_177589_6_)`
- `protected ModelBlock makeItemModel(ModelBlock p_177582_1_)`
- `static<T extends ResourceLocation> void registerItemVariants(Item item, T... names)`
- `protected void registerVariant(ModelBlockDefinition p_177569_1_, ModelResourceLocation p_177569_2_)`
- `protected void registerVariantNames()`
- `IRegistry<ModelResourceLocation, IBakedModel> setupModelRegistry()`

## Fields

- `protected RegistrySimple<ModelResourceLocation, IBakedModel> bakedRegistry`
- `protected BlockModelShapes blockModelShapes`
- `protected static java.util.Set<ResourceLocation> LOCATIONS_BUILTIN_TEXTURES`
- `protected static ModelBlock MODEL_CLOCK`
- `protected static ModelBlock MODEL_COMPASS`
- `protected static ModelBlock MODEL_ENTITY`
- `protected static ModelBlock MODEL_GENERATED`
- `protected static ModelResourceLocation MODEL_MISSING`
- `protected IResourceManager resourceManager`
- `protected java.util.Map<ResourceLocation, TextureAtlasSprite> sprites`
- `protected TextureMap textureMap`
