---
title: "LayerArmorBase"
description: "Hook to allow item-sensitive armor model. for LayerBipedArmor."
package: "net/minecraft/client/renderer/entity/layers"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/entity/layers/LayerArmorBase.html"
sourceType: javadoc
---

# LayerArmorBase

## Class signature

```java
public abstract class LayerArmorBase<T extends ModelBase > extends java.lang.Object implements LayerRenderer < EntityLivingBase >
```

## Constructors

- `public LayerArmorBase( RenderLivingBase <?> rendererIn)`

## Methods

- `public void doRenderLayer( EntityLivingBase entitylivingbaseIn, float limbSwing, float limbSwingAmount, float partialTicks, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `public boolean shouldCombineTextures()`
- `@Nullable public ItemStack getItemStackFromSlot( EntityLivingBase living, EntityEquipmentSlot slotIn)`
- `public T getModelFromSlot( EntityEquipmentSlot slotIn)`
- `public static void renderEnchantedGlint( RenderLivingBase <?> p_188364_0_, EntityLivingBase p_188364_1_, ModelBase model, float p_188364_3_, float p_188364_4_, float p_188364_5_, float p_188364_6_, float p_188364_7_, float p_188364_8_, float p_188364_9_)`
- `protected abstract void initArmor()`
- `protected abstract void setModelSlotVisible( T p_188359_1_, EntityEquipmentSlot slotIn)`
- `protected T getArmorModelHook( EntityLivingBase entity, ItemStack itemStack, EntityEquipmentSlot slot, T model)`
- `public ResourceLocation getArmorResource( Entity entity, ItemStack stack, EntityEquipmentSlot slot, java.lang.String type)`

## Description

Hook to allow item-sensitive armor model. for LayerBipedArmor.
