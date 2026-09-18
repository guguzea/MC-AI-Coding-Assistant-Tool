---
title: "RenderManager"
description: "public class RenderManager extends java.lang.Object"
package: "net/minecraft/client/renderer/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/entity/RenderManager.html"
sourceType: javadoc
---

# RenderManager

## Class signature

```java
public class RenderManager extends java.lang.Object
```

## Constructors

- `public RenderManager( TextureManager renderEngineIn, RenderItem itemRendererIn)`

## Methods

- `public java.util.Map<java.lang.String, RenderPlayer > getSkinMap()`
- `public void setRenderPosition(double renderPosXIn, double renderPosYIn, double renderPosZIn)`
- `public <T extends Entity > Render <T> getEntityClassRenderObject(java.lang.Class<? extends Entity > entityClass)`
- `@Nullable public <T extends Entity > Render <T> getEntityRenderObject(T entityIn)`
- `public void cacheActiveRenderInfo( World worldIn, FontRenderer textRendererIn, Entity livingPlayerIn, Entity pointedEntityIn, GameSettings optionsIn, float partialTicks)`
- `public void setPlayerViewY(float playerViewYIn)`
- `public boolean isRenderShadow()`
- `public void setRenderShadow(boolean renderShadowIn)`
- `public void setDebugBoundingBox(boolean debugBoundingBoxIn)`
- `public boolean isDebugBoundingBox()`
- `public boolean isRenderMultipass( Entity p_188390_1_)`
- `public boolean shouldRender( Entity entityIn, ICamera camera, double camX, double camY, double camZ)`
- `public void renderEntityStatic( Entity entityIn, float partialTicks, boolean p_188388_3_)`
- `public void doRenderEntity( Entity entityIn, double x, double y, double z, float yaw, float partialTicks, boolean p_188391_10_)`
- `public void renderMultipass( Entity p_188389_1_, float p_188389_2_)`
- `public void setWorld(@Nullable World worldIn)`
- `public double getDistanceToCamera(double x, double y, double z)`
- `public FontRenderer getFontRenderer()`
- `public void setRenderOutlines(boolean renderOutlinesIn)`
