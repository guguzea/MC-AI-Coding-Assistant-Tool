# ModelBakery

## Class signature

```java
public class ModelBakery extends java.lang.Object
```

## Constructors

- `public ModelBakery( IResourceManager resourceManagerIn, TextureMap textureMapIn, BlockModelShapes blockModelShapesIn)`

## Methods

- `public IRegistry < ModelResourceLocation , IBakedModel > setupModelRegistry()`
- `protected void loadBlocks()`
- `protected void loadBlock( BlockStateMapper blockstatemapper, Block block, ResourceLocation resourcelocation)`
- `protected void loadVariantItemModels()`
- `protected void registerVariant( ModelBlockDefinition blockstateDefinition, ModelResourceLocation location)`
- `protected ModelBlockDefinition getModelBlockDefinition( ResourceLocation location)`
- `protected void loadVariantModels()`
- `protected void loadMultipartVariantModels()`
- `protected void loadVariantList( ModelResourceLocation p_188638_1_, VariantList p_188638_2_)`
- `protected ModelBlock loadModel( ResourceLocation location) throws java.io.IOException`
- `protected ResourceLocation getModelLocation( ResourceLocation location)`
- `protected void loadItemModels()`
- `protected void registerVariantNames()`
- `protected java.util.List<java.lang.String> getVariantNames( Item stack)`
- `protected ResourceLocation getItemLocation(java.lang.String location)`
- `protected IBakedModel bakeModel( ModelBlock modelBlockIn, ITransformation modelRotationIn, boolean uvLocked)`
- `protected BakedQuad makeBakedQuad( BlockPart p_177589_1_, BlockPartFace p_177589_2_, TextureAtlasSprite p_177589_3_, EnumFacing p_177589_4_, ITransformation p_177589_5_, boolean p_177589_6_)`
- `protected java.util.Set< ResourceLocation > getTextureLocations( ModelBlock p_177585_1_)`
- `protected boolean hasItemModel(@Nullable ModelBlock p_177581_1_)`
- `protected boolean isCustomRenderer(@Nullable ModelBlock p_177587_1_)`
- `protected ModelBlock makeItemModel( ModelBlock p_177582_1_)`
- `protected void registerMultipartVariant( ModelBlockDefinition definition, java.util.Collection< ModelResourceLocation > locations)`
- `public static void registerItemVariants( Item item, ResourceLocation ... names)`