# ModelBakery

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ModelBakery

## Class signature

```java
public class ModelBakery extends java.lang.Object
```

## Constructors

- `ModelBakery(IResourceManager p_i46085_1_, TextureMap p_i46085_2_, BlockModelShapes p_i46085_3_)`

## Methods

- `protected IBakedModel bakeModel(ModelBlock modelBlockIn, ITransformation modelRotationIn, boolean uvLocked)`
- `protected ResourceLocation getItemLocation(java.lang.String p_177583_1_)`
- `protected ModelBlockDefinition getModelBlockDefinition(ResourceLocation p_177586_1_)`
- `protected ResourceLocation getModelLocation(ResourceLocation p_177580_1_)`
- `protected java.util.Set<ResourceLocation> getTextureLocations(ModelBlock p_177585_1_)`
- `protected java.util.List<java.lang.String> getVariantNames(Item stack)`
- `protected boolean hasItemModel(ModelBlock p_177581_1_)`
- `protected boolean isCustomRenderer(ModelBlock p_177587_1_)`
- `protected void loadBlock(BlockStateMapper blockstatemapper, Block block, ResourceLocation resourcelocation)`
- `protected void loadBlocks()`
- `protected void loadItemModels()`
- `protected ModelBlock loadModel(ResourceLocation p_177594_1_)`
- `protected void loadMultipartVariantModels()`
- `protected void loadVariantItemModels()`
- `protected void loadVariantList(ModelResourceLocation p_188638_1_, VariantList p_188638_2_)`
- `protected void loadVariantModels()`
- `protected BakedQuad makeBakedQuad(BlockPart p_177589_1_, BlockPartFace p_177589_2_, TextureAtlasSprite p_177589_3_, EnumFacing p_177589_4_, ITransformation p_177589_5_, boolean p_177589_6_)`
- `protected ModelBlock makeItemModel(ModelBlock p_177582_1_)`
- `static void registerItemVariants(Item item, ResourceLocation ... names)`
- `protected void registerMultipartVariant(ModelBlockDefinition definition, java.util.Collection<ModelResourceLocation> locations)`
- `protected void registerVariant(ModelBlockDefinition p_177569_1_, ModelResourceLocation p_177569_2_)`
- `protected void registerVariantNames()`
- `IRegistry<ModelResourceLocation, IBakedModel> setupModelRegistry()`

## Fields

- `protected RegistrySimple<ModelResourceLocation, IBakedModel> bakedRegistry`
- `protected BlockModelShapes blockModelShapes`
- `protected static java.util.Set<ResourceLocation> LOCATIONS_BUILTIN_TEXTURES`
- `protected static ModelBlock MODEL_ENTITY`
- `protected static ModelBlock MODEL_GENERATED`
- `protected static ModelResourceLocation MODEL_MISSING`
- `protected IResourceManager resourceManager`
- `protected java.util.Map<ResourceLocation, TextureAtlasSprite> sprites`
- `protected TextureMap textureMap`