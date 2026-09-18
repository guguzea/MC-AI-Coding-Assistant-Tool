---
title: "Render"
description: "Determines the darkness of the object's shadow."
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/Render.html"
sourceType: javadoc
---

# Render

## Class signature

```java
public abstract class Render<T extends Entity > extends java.lang.Object
```

## Constructors

- `protected Render( RenderManager renderManager)`

## Methods

- `public boolean shouldRender( T livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected void renderName( T entity, double x, double y, double z)`
- `protected boolean canRenderName( T entity)`
- `protected void renderOffsetLivingLabel( T entityIn, double x, double y, double z, java.lang.String str, float p_177069_9_, double p_177069_10_)`
- `protected abstract ResourceLocation getEntityTexture( T entity)`
- `protected boolean bindEntityTexture( T entity)`
- `public void bindTexture( ResourceLocation location)`
- `public static void renderOffsetAABB( AxisAlignedBB boundingBox, double x, double y, double z)`
- `public void doRenderShadowAndFire( Entity entityIn, double x, double y, double z, float yaw, float partialTicks)`
- `public FontRenderer getFontRendererFromRenderManager()`
- `protected void renderLivingLabel( T entityIn, java.lang.String str, double x, double y, double z, int maxDistance)`
- `public RenderManager getRenderManager()`

## Description

Determines the darkness of the object's shadow.
