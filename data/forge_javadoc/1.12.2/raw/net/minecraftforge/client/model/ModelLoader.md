---
title: "ModelLoader"
description: "16x16 pure white sprite."
package: "net/minecraftforge/client/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/ModelLoader.html"
sourceType: javadoc
---

# ModelLoader

## Class signature

```java
public final class ModelLoader extends ModelBakery
```

## Constructors

- `public ModelLoader( IResourceManager manager, TextureMap map, BlockModelShapes shapes)`

## Methods

- `public boolean isLoading()`
- `public IRegistry < ModelResourceLocation , IBakedModel > setupModelRegistry()`
- `protected void loadVariantModels()`
- `protected void loadMultipartVariantModels()`
- `protected void loadBlocks()`
- `protected void registerVariant( ModelBlockDefinition definition, ModelResourceLocation location)`
- `protected void registerMultipartVariant( ModelBlockDefinition definition, java.util.Collection< ModelResourceLocation > locations)`
- `protected ModelBlockDefinition getModelBlockDefinition( ResourceLocation location)`
- `protected void loadItemModels()`
- `public static ModelResourceLocation getInventoryVariant(java.lang.String s)`
- `protected ResourceLocation getModelLocation( ResourceLocation model)`
- `protected IModel getMissingModel()`
- `public void onPostBakeEvent( IRegistry < ModelResourceLocation , IBakedModel > modelRegistry)`
- `public static void setCustomStateMapper( Block block, IStateMapper mapper)`
- `public static void onRegisterAllBlocks( BlockModelShapes shapes)`
- `public static void setCustomModelResourceLocation( Item item, int metadata, ModelResourceLocation model)`
- `public static void setCustomMeshDefinition( Item item, ItemMeshDefinition meshDefinition)`
- `public static void setBucketModelDefinition( Item item)`
- `public static void onRegisterItems( ItemModelMesher mesher)`
- `public static java.util.function.Function< ResourceLocation , TextureAtlasSprite > defaultTextureGetter()`

## Description

16x16 pure white sprite.
