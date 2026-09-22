---
title: "ModelLoader"
description: "public final class ModelLoader extends ModelBakery"
package: "net/minecraftforge/client/model"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/ModelLoader.html"
sourceType: javadoc
---

# ModelLoader

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ModelBakery → net.minecraftforge.client.model.ModelLoader

## Class signature

```java
public final class ModelLoader extends ModelBakery
```

## Methods

- `static com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> defaultTextureGetter()` — Get the default texture getter the models will be baked with.
- `static ModelResourceLocation getInventoryVariant(java.lang.String s)` — Hooked from ModelBakery, allows using MRLs that don't end with "inventory" for items.
- `protected IModel getMissingModel()`
- `protected ModelBlockDefinition getModelBlockDefinition(ResourceLocation location)`
- `protected ResourceLocation getModelLocation(ResourceLocation model)`
- `boolean isLoading()`
- `protected void loadBlocks()`
- `protected void loadItemModels()`
- `protected void loadMultipartVariantModels()`
- `protected void loadVariantModels()`
- `void onPostBakeEvent(IRegistry<ModelResourceLocation, IBakedModel> modelRegistry)` — Internal, do not use.
- `static void onRegisterAllBlocks(BlockModelShapes shapes)` — Internal, do not use.
- `static void onRegisterItems(ItemModelMesher mesher)` — Internal, do not use.
- `protected void registerMultipartVariant(ModelBlockDefinition definition, java.util.Collection<ModelResourceLocation> locations)`
- `protected void registerVariant(ModelBlockDefinition definition, ModelResourceLocation location)`
- `static void setBucketModelDefinition(Item item)` — Helper method for registering all itemstacks for given item to map to universal bucket model.
- `static void setCustomMeshDefinition(Item item, ItemMeshDefinition meshDefinition)` — Adds generic ItemStack -> model variant logic.
- `static void setCustomModelResourceLocation(Item item, int metadata, ModelResourceLocation model)` — Adds a simple mapping from Item + metadata to the model variant.
- `static void setCustomStateMapper(Block block, IStateMapper mapper)` — Adds a custom IBlockState -> model variant logic.
- `IRegistry<ModelResourceLocation, IBakedModel> setupModelRegistry()`

## Fields

- `ModelLoader`
