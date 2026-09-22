# ModelLoader

**Inheritance:** java.lang.Object → net.minecraft.client.resources.model.ModelBakery → net.minecraftforge.client.model.ModelLoader

## Class signature

```java
public class ModelLoader extends ModelBakery
```

## Methods

- `static<any> defaultTextureGetter()`
- `static ModelResourceLocation getInventoryVariant(java.lang.String s)`
- `IModel getItemModel()`
- `IModel getMissingModel()`
- `IModel getModel(ResourceLocation location)`
- `protected ModelBlockDefinition getModelBlockDefinition(ResourceLocation location)`
- `protected ResourceLocation getModelLocation(ResourceLocation model)`
- `boolean isLoading()`
- `void onPostBakeEvent(IRegistry<ModelResourceLocation, IBakedModel> modelRegistry)`
- `static void onRegisterAllBlocks(BlockModelShapes shapes)`
- `static void onRegisterItems(ItemModelMesher mesher)`
- `protected void registerVariant(ModelBlockDefinition definition, ModelResourceLocation location)`
- `static void setBucketModelDefinition(Item item)`
- `static void setCustomMeshDefinition(Item item, ItemMeshDefinition meshDefinition)` — Adds generic ItemStack -> model variant logic.
- `static void setCustomModelResourceLocation(Item item, int metadata, ModelResourceLocation model)` — Adds a simple mapping from Item + metadata to the model variant.
- `static void setCustomStateMapper(Block block, IStateMapper mapper)` — Adds a custom IBlockState -> model variant logic.
- `IRegistry<ModelResourceLocation, IBakedModel> setupModelRegistry()`

## Fields

- `ModelLoader`