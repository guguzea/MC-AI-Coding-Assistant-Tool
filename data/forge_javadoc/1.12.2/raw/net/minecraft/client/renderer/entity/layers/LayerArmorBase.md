---
title: "LayerArmorBase"
description: "public abstract class LayerArmorBase<T extends ModelBase> extends java.lang.Object implements LayerRenderer<EntityLivingBase>"
package: "net/minecraft/client/renderer/entity/layers"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/entity/layers/LayerArmorBase.html"
sourceType: javadoc
---

# LayerArmorBase

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.layers.LayerArmorBase<T>

## Class signature

```java
public abstract class LayerArmorBase<T extends ModelBase> extends java.lang.Object implements LayerRenderer<EntityLivingBase>
```

## Constructors

- `LayerArmorBase(RenderLivingBase<?> rendererIn)`

## Methods

- `void doRenderLayer(EntityLivingBase entitylivingbaseIn, float limbSwing, float limbSwingAmount, float partialTicks, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `protected T getArmorModelHook(EntityLivingBase entity, ItemStack itemStack, EntityEquipmentSlot slot, T model)` — Hook to allow item-sensitive armor model. for LayerBipedArmor.
- `ResourceLocation getArmorResource(Entity entity, ItemStack stack, EntityEquipmentSlot slot, java.lang.String type)` — More generic ForgeHook version of the above function, it allows for Items to have more control over what texture they provide.
- `T getModelFromSlot(EntityEquipmentSlot slotIn)`
- `protected abstract void initArmor()`
- `static void renderEnchantedGlint(RenderLivingBase<?> p_188364_0_, EntityLivingBase p_188364_1_, ModelBase model, float p_188364_3_, float p_188364_4_, float p_188364_5_, float p_188364_6_, float p_188364_7_, float p_188364_8_, float p_188364_9_)`
- `protected abstract void setModelSlotVisible(T p_188359_1_, EntityEquipmentSlot slotIn)`
- `boolean shouldCombineTextures()`

## Fields

- `protected static ResourceLocation ENCHANTED_ITEM_GLINT_RES`
- `protected T modelArmor`
- `protected T modelLeggings`
