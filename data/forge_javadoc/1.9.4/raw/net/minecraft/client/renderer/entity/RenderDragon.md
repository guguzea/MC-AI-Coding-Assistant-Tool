---
title: "RenderDragon"
description: "public class RenderDragon extends RenderLiving<EntityDragon>"
package: "net/minecraft/client/renderer/entity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/entity/RenderDragon.html"
sourceType: javadoc
---

# RenderDragon

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RenderLivingBase<T> → net.minecraft.client.renderer.entity.RenderLiving<EntityDragon> → net.minecraft.client.renderer.entity.RenderDragon

## Class signature

```java
public class RenderDragon extends RenderLiving<EntityDragon>
```

## Constructors

- `RenderDragon(RenderManager renderManagerIn)`

## Methods

- `void doRender(EntityDragon entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected ResourceLocation getEntityTexture(EntityDragon entity)`
- `static void renderCrystalBeams(double p_188325_0_, double p_188325_2_, double p_188325_4_, float p_188325_6_, double p_188325_7_, double p_188325_9_, double p_188325_11_, int p_188325_13_, double p_188325_14_, double p_188325_16_, double p_188325_18_)`
- `protected void renderModel(EntityDragon entitylivingbaseIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor)`
- `protected void rotateCorpse(EntityDragon entityLiving, float p_77043_2_, float p_77043_3_, float partialTicks)`

## Fields

- `static ResourceLocation ENDERCRYSTAL_BEAM_TEXTURES`
- `protected ModelDragon modelDragon`
