---
title: "RenderLivingBase"
description: "public abstract class RenderLivingBase<T extends EntityLivingBase > extends Render <T>"
package: "net/minecraft/client/renderer/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/entity/RenderLivingBase.html"
sourceType: javadoc
---

# RenderLivingBase

## Class signature

```java
public abstract class RenderLivingBase<T extends EntityLivingBase > extends Render <T>
```

## Constructors

- `public RenderLivingBase( RenderManager renderManagerIn, ModelBase modelBaseIn, float shadowSizeIn)`

## Methods

- `public <V extends EntityLivingBase ,U extends LayerRenderer <V>> boolean addLayer(U layer)`
- `public <V extends EntityLivingBase ,U extends LayerRenderer <V>> boolean removeLayer(U layer)`
- `public ModelBase getMainModel()`
- `protected float interpolateRotation(float prevYawOffset, float yawOffset, float partialTicks)`
- `public void transformHeldFull3DItemLayer()`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public float prepareScale( T entitylivingbaseIn, float partialTicks)`
- `protected boolean setScoreTeamColor( T entityLivingBaseIn)`
- `protected void unsetScoreTeamColor()`
- `protected void renderModel( T entitylivingbaseIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor)`
- `protected boolean setDoRenderBrightness( T entityLivingBaseIn, float partialTicks)`
- `protected boolean setBrightness( T entitylivingbaseIn, float partialTicks, boolean combineTextures)`
- `protected void unsetBrightness()`
- `protected void renderLivingAt( T entityLivingBaseIn, double x, double y, double z)`
- `protected void rotateCorpse( T entityLiving, float p_77043_2_, float p_77043_3_, float partialTicks)`
- `protected float getSwingProgress( T livingBase, float partialTickTime)`
- `protected float handleRotationFloat( T livingBase, float partialTicks)`
- `protected void renderLayers( T entitylivingbaseIn, float limbSwing, float limbSwingAmount, float partialTicks, float ageInTicks, float netHeadYaw, float headPitch, float scaleIn)`
- `protected float getDeathMaxRotation( T entityLivingBaseIn)`
- `protected int getColorMultiplier( T entitylivingbaseIn, float lightBrightness, float partialTickTime)`
- `protected void preRenderCallback( T entitylivingbaseIn, float partialTickTime)`
- `public void renderName( T entity, double x, double y, double z)`
- `protected boolean canRenderName( T entity)`
