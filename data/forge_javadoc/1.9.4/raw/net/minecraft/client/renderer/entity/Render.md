---
title: "Render"
description: "public abstract class Render<T extends Entity > extends java.lang.Object"
package: "net/minecraft/client/renderer/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/entity/Render.html"
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

- `public void setRenderOutlines(boolean renderOutlinesIn)`
- `public boolean shouldRender( T livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected int getTeamColor( T entityIn)`
- `protected void renderName( T entity, double x, double y, double z)`
- `protected boolean canRenderName( T entity)`
- `protected void renderEntityName( T entityIn, double x, double y, double z, java.lang.String name, double p_188296_9_)`
- `protected abstract ResourceLocation getEntityTexture( T entity)`
- `protected boolean bindEntityTexture( T entity)`
- `public void bindTexture( ResourceLocation location)`
- `public static void renderOffsetAABB( AxisAlignedBB boundingBox, double x, double y, double z)`
- `public void doRenderShadowAndFire( Entity entityIn, double x, double y, double z, float yaw, float partialTicks)`
- `public FontRenderer getFontRendererFromRenderManager()`
- `protected void renderLivingLabel( T entityIn, java.lang.String str, double x, double y, double z, int maxDistance)`
- `public RenderManager getRenderManager()`
- `public boolean isMultipass()`
- `public void renderMultipass( T p_188300_1_, double p_188300_2_, double p_188300_4_, double p_188300_6_, float p_188300_8_, float p_188300_9_)`
