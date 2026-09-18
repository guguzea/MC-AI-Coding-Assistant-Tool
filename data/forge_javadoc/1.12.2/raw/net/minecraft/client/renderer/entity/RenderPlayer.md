---
title: "RenderPlayer"
description: "public class RenderPlayer extends RenderLivingBase < AbstractClientPlayer >"
package: "net/minecraft/client/renderer/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/entity/RenderPlayer.html"
sourceType: javadoc
---

# RenderPlayer

## Class signature

```java
public class RenderPlayer extends RenderLivingBase < AbstractClientPlayer >
```

## Constructors

- `public RenderPlayer( RenderManager renderManager)`
- `public RenderPlayer( RenderManager renderManager, boolean useSmallArms)`

## Methods

- `public ModelPlayer getMainModel()`
- `public void doRender( AbstractClientPlayer entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public ResourceLocation getEntityTexture( AbstractClientPlayer entity)`
- `public void transformHeldFull3DItemLayer()`
- `protected void preRenderCallback( AbstractClientPlayer entitylivingbaseIn, float partialTickTime)`
- `protected void renderEntityName( AbstractClientPlayer entityIn, double x, double y, double z, java.lang.String name, double distanceSq)`
- `public void renderRightArm( AbstractClientPlayer clientPlayer)`
- `public void renderLeftArm( AbstractClientPlayer clientPlayer)`
- `protected void renderLivingAt( AbstractClientPlayer entityLivingBaseIn, double x, double y, double z)`
- `protected void applyRotations( AbstractClientPlayer entityLiving, float p_77043_2_, float rotationYaw, float partialTicks)`
