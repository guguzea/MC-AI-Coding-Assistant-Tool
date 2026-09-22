---
title: "LayerArmorBase"
description: "public abstract class LayerArmorBase<T extends ModelBase> extends java.lang.Object implements LayerRenderer<EntityLivingBase>"
package: "net/minecraft/client/renderer/entity/layers"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/layers/LayerArmorBase.html"
sourceType: javadoc
---

# LayerArmorBase

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.layers.LayerArmorBase<T>

## Class signature

```java
public abstract class LayerArmorBase<T extends ModelBase> extends java.lang.Object implements LayerRenderer<EntityLivingBase>
```

## Constructors

- `LayerArmorBase(RendererLivingEntity<?> rendererIn)`

## Methods

- `void doRenderLayer(EntityLivingBase entitylivingbaseIn, float p_177141_2_, float p_177141_3_, float partialTicks, float p_177141_5_, float p_177141_6_, float p_177141_7_, float scale)`
- `T func_177175_a(int p_177175_1_)`
- `protected abstract void func_177179_a(T p_177179_1_, int p_177179_2_)`
- `protected T getArmorModelHook(EntityLivingBase entity, ItemStack itemStack, int slot, T model)` — Hook to allow item-sensitive armor model. for LayerBipedArmor.
- `ResourceLocation getArmorResource(Entity entity, ItemStack stack, int slot, java.lang.String type)` — More generic ForgeHook version of the above function, it allows for Items to have more control over what texture they provide.
- `ItemStack getCurrentArmor(EntityLivingBase entitylivingbaseIn, int armorSlot)`
- `protected abstract void initArmor()`
- `boolean shouldCombineTextures()`

## Fields

- `protected static ResourceLocation ENCHANTED_ITEM_GLINT_RES`
- `protected T field_177186_d`
- `protected T field_177189_c`
