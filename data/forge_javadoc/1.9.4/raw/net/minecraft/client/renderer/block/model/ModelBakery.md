---
title: "ModelBakery"
description: "public class ModelBakery extends java.lang.Object"
package: "net/minecraft/client/renderer/block/model"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/block/model/ModelBakery.html"
sourceType: javadoc
---

# ModelBakery

## Class signature

```java
public class ModelBakery extends java.lang.Object
```

## Constructors

- `public ModelBakery( IResourceManager p_i46085_1_, TextureMap p_i46085_2_, BlockModelShapes p_i46085_3_)`

## Methods

- `public IRegistry < ModelResourceLocation , IBakedModel > setupModelRegistry()`
- `protected void loadBlocks()`
- `protected void loadBlock( BlockStateMapper blockstatemapper, Block block, ResourceLocation resourcelocation)`
- `protected void loadVariantItemModels()`
- `protected void registerVariant( ModelBlockDefinition p_177569_1_, ModelResourceLocation p_177569_2_)`
- `protected ModelBlockDefinition getModelBlockDefinition( ResourceLocation p_177586_1_)`
- `protected void loadVariantModels()`
- `protected void loadMultipartVariantModels()`
- `protected void loadVariantList( ModelResourceLocation p_188638_1_, VariantList p_188638_2_)`
- `protected ModelBlock loadModel( ResourceLocation p_177594_1_) throws java.io.IOException`
- `protected ResourceLocation getModelLocation( ResourceLocation p_177580_1_)`
- `protected void loadItemModels()`
- `protected void registerVariantNames()`
- `protected java.util.List<java.lang.String> getVariantNames( Item stack)`
- `protected ResourceLocation getItemLocation(java.lang.String p_177583_1_)`
- `protected IBakedModel bakeModel( ModelBlock modelBlockIn, ITransformation modelRotationIn, boolean uvLocked)`
- `protected BakedQuad makeBakedQuad( BlockPart p_177589_1_, BlockPartFace p_177589_2_, TextureAtlasSprite p_177589_3_, EnumFacing p_177589_4_, ITransformation p_177589_5_, boolean p_177589_6_)`
- `protected java.util.Set< ResourceLocation > getTextureLocations( ModelBlock p_177585_1_)`
- `protected boolean hasItemModel(@Nullable ModelBlock p_177581_1_)`
- `protected boolean isCustomRenderer(@Nullable ModelBlock p_177587_1_)`
- `protected ModelBlock makeItemModel( ModelBlock p_177582_1_)`
- `protected void registerMultipartVariant( ModelBlockDefinition definition, java.util.Collection< ModelResourceLocation > locations)`
- `public static void registerItemVariants( Item item, ResourceLocation ... names)`
