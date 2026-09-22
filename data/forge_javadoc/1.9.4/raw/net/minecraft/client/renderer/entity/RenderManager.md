---
title: "RenderManager"
description: "public class RenderManager extends java.lang.Object"
package: "net/minecraft/client/renderer/entity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/entity/RenderManager.html"
sourceType: javadoc
---

# RenderManager

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.RenderManager

## Class signature

```java
public class RenderManager extends java.lang.Object
```

## Constructors

- `RenderManager(TextureManager renderEngineIn, RenderItem itemRendererIn)`

## Methods

- `void cacheActiveRenderInfo(World worldIn, FontRenderer textRendererIn, Entity livingPlayerIn, Entity pointedEntityIn, GameSettings optionsIn, float partialTicks)`
- `void doRenderEntity(Entity entityIn, double x, double y, double z, float yaw, float partialTicks, boolean p_188391_10_)`
- `double getDistanceToCamera(double x, double y, double z)`
- `<T extends Entity> Render<T> getEntityClassRenderObject(java.lang.Class<? extends Entity> entityClass)`
- `<T extends Entity> Render<T> getEntityRenderObject(T entityIn)`
- `FontRenderer getFontRenderer()`
- `java.util.Map<java.lang.String, RenderPlayer> getSkinMap()`
- `boolean isDebugBoundingBox()`
- `boolean isRenderMultipass(Entity p_188390_1_)`
- `boolean isRenderShadow()`
- `void renderEntityStatic(Entity p_188388_1_, float p_188388_2_, boolean p_188388_3_)`
- `void renderMultipass(Entity p_188389_1_, float p_188389_2_)`
- `void set(World worldIn)`
- `void setDebugBoundingBox(boolean debugBoundingBoxIn)`
- `void setPlayerViewY(float playerViewYIn)`
- `void setRenderOutlines(boolean renderOutlinesIn)`
- `void setRenderPosition(double renderPosXIn, double renderPosYIn, double renderPosZIn)`
- `void setRenderShadow(boolean renderShadowIn)`
- `boolean shouldRender(Entity entityIn, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `java.util.Map<java.lang.Class<? extends Entity>, Render<? extends Entity>> entityRenderMap`
- `GameSettings options`
- `float playerViewX`
- `float playerViewY`
- `Entity pointedEntity`
- `TextureManager renderEngine`
- `Entity renderViewEntity`
- `double viewerPosX`
- `double viewerPosY`
- `double viewerPosZ`
- `World worldObj`
