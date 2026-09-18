# ModelLoader

## Class signature

```java
public class ModelLoader extends ModelBakery
```

## Constructors

- `public ModelLoader( IResourceManager manager, TextureMap map, BlockModelShapes shapes)`

## Methods

- `public boolean isLoading()`
- `public IRegistry < ModelResourceLocation , IBakedModel > setupModelRegistry()`
- `protected void registerVariant( ModelBlockDefinition definition, ModelResourceLocation location)`
- `protected ModelBlockDefinition getModelBlockDefinition( ResourceLocation location)`
- `public static ModelResourceLocation getInventoryVariant(java.lang.String s)`
- `public IModel getModel( ResourceLocation location) throws java.io.IOException`
- `protected ResourceLocation getModelLocation( ResourceLocation model)`
- `public IModel getMissingModel()`
- `public IModel getItemModel()`
- `public void onPostBakeEvent( IRegistry < ModelResourceLocation , IBakedModel > modelRegistry)`
- `public static void setCustomStateMapper( Block block, IStateMapper mapper)`
- `public static void onRegisterAllBlocks( BlockModelShapes shapes)`
- `public static void setCustomModelResourceLocation( Item item, int metadata, ModelResourceLocation model)`
- `public static void setCustomMeshDefinition( Item item, ItemMeshDefinition meshDefinition)`
- `public static void setBucketModelDefinition( Item item)`
- `public static void onRegisterItems( ItemModelMesher mesher)`
- `public static <any> defaultTextureGetter()`

## Description

Deprecated.