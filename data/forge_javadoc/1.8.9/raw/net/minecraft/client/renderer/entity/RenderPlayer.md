---
title: "RenderPlayer"
description: "Actually renders the given argument."
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderPlayer.html"
sourceType: javadoc
---

# RenderPlayer

## Class signature

```java
public class RenderPlayer extends RendererLivingEntity < AbstractClientPlayer >
```

## Constructors

- `public RenderPlayer( RenderManager renderManager)`
- `public RenderPlayer( RenderManager renderManager, boolean useSmallArms)`

## Methods

- `public ModelPlayer getMainModel()`
- `public void doRender( AbstractClientPlayer entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected ResourceLocation getEntityTexture( AbstractClientPlayer entity)`
- `public void transformHeldFull3DItemLayer()`
- `protected void preRenderCallback( AbstractClientPlayer entitylivingbaseIn, float partialTickTime)`
- `protected void renderOffsetLivingLabel( AbstractClientPlayer entityIn, double x, double y, double z, java.lang.String str, float p_177069_9_, double p_177069_10_)`
- `public void renderRightArm( AbstractClientPlayer clientPlayer)`
- `public void renderLeftArm( AbstractClientPlayer clientPlayer)`
- `protected void renderLivingAt( AbstractClientPlayer entityLivingBaseIn, double x, double y, double z)`
- `protected void rotateCorpse( AbstractClientPlayer bat, float p_77043_2_, float p_77043_3_, float partialTicks)`

## Description

Actually renders the given argument.
