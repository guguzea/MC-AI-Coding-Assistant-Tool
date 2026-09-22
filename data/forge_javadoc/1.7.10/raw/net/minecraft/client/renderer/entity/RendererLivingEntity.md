---
title: "RendererLivingEntity"
description: "public abstract class RendererLivingEntity extends Render"
package: "net/minecraft/client/renderer/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/renderer/entity/RendererLivingEntity.html"
sourceType: javadoc
---

# RendererLivingEntity

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render → net.minecraft.client.renderer.entity.RendererLivingEntity

## Class signature

```java
public abstract class RendererLivingEntity extends Render
```

## Constructors

- `RendererLivingEntity(ModelBase p_i1261_1_, float p_i1261_2_)`

## Methods

- `void doRender(Entity p_76986_1_, double p_76986_2_, double p_76986_4_, double p_76986_6_, float p_76986_8_, float p_76986_9_)`
- `void doRender(EntityLivingBase p_76986_1_, double p_76986_2_, double p_76986_4_, double p_76986_6_, float p_76986_8_, float p_76986_9_)`
- `protected boolean func_110813_b(EntityLivingBase p_110813_1_)`
- `protected void func_82408_c(EntityLivingBase p_82408_1_, int p_82408_2_, float p_82408_3_)`
- `protected void func_96449_a(EntityLivingBase p_96449_1_, double p_96449_2_, double p_96449_4_, double p_96449_6_, java.lang.String p_96449_8_, float p_96449_9_, double p_96449_10_)`
- `protected int getColorMultiplier(EntityLivingBase p_77030_1_, float p_77030_2_, float p_77030_3_)`
- `protected float getDeathMaxRotation(EntityLivingBase p_77037_1_)`
- `protected float handleRotationFloat(EntityLivingBase p_77044_1_, float p_77044_2_)`
- `protected int inheritRenderPass(EntityLivingBase p_77035_1_, int p_77035_2_, float p_77035_3_)`
- `protected void passSpecialRender(EntityLivingBase p_77033_1_, double p_77033_2_, double p_77033_4_, double p_77033_6_)`
- `protected void preRenderCallback(EntityLivingBase p_77041_1_, float p_77041_2_)`
- `protected void renderArrowsStuckInEntity(EntityLivingBase p_85093_1_, float p_85093_2_)`
- `protected void renderEquippedItems(EntityLivingBase p_77029_1_, float p_77029_2_)`
- `protected void renderLivingAt(EntityLivingBase p_77039_1_, double p_77039_2_, double p_77039_4_, double p_77039_6_)`
- `protected void renderModel(EntityLivingBase p_77036_1_, float p_77036_2_, float p_77036_3_, float p_77036_4_, float p_77036_5_, float p_77036_6_, float p_77036_7_)`
- `protected float renderSwingProgress(EntityLivingBase p_77040_1_, float p_77040_2_)`
- `protected void rotateCorpse(EntityLivingBase p_77043_1_, float p_77043_2_, float p_77043_3_, float p_77043_4_)`
- `void setRenderPassModel(ModelBase p_77042_1_)`
- `protected int shouldRenderPass(EntityLivingBase p_77032_1_, int p_77032_2_, float p_77032_3_)`

## Fields

- `protected ModelBase mainModel`
- `protected ModelBase renderPassModel`
