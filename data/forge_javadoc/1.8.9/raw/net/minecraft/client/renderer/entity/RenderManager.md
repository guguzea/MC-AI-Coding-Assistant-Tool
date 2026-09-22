---
title: "RenderManager"
description: "public class RenderManager extends java.lang.Object"
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderManager.html"
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
- `boolean doRenderEntity(Entity entity, double x, double y, double z, float entityYaw, float partialTicks, boolean p_147939_10_)`
- `double getDistanceToCamera(double p_78714_1_, double p_78714_3_, double p_78714_5_)`
- `<T extends Entity> Render<T> getEntityClassRenderObject(java.lang.Class<? extends Entity> p_78715_1_)`
- `<T extends Entity> Render<T> getEntityRenderObject(Entity entityIn)`
- `FontRenderer getFontRenderer()` — Returns the font renderer
- `java.util.Map<java.lang.String, RenderPlayer> getSkinMap()`
- `boolean isDebugBoundingBox()`
- `boolean isRenderShadow()`
- `boolean renderEntitySimple(Entity entityIn, float partialTicks)`
- `boolean renderEntityStatic(Entity entity, float partialTicks, boolean p_147936_3_)`
- `boolean renderEntityWithPosYaw(Entity entityIn, double x, double y, double z, float entityYaw, float partialTicks)`
- `void renderWitherSkull(Entity entityIn, float partialTicks)`
- `void set(World worldIn)` — World sets this RenderManager's worldObj to the world provided
- `void setDebugBoundingBox(boolean debugBoundingBoxIn)`
- `void setPlayerViewY(float playerViewYIn)`
- `void setRenderOutlines(boolean renderOutlinesIn)`
- `void setRenderPosition(double renderPosXIn, double renderPosYIn, double renderPosZIn)`
- `void setRenderShadow(boolean renderShadowIn)`
- `boolean shouldRender(Entity entityIn, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `java.util.Map<java.lang.Class<? extends Entity>, Render<? extends Entity>> entityRenderMap`
- `Entity livingPlayer` — Rendermanager's variable for the player
- `GameSettings options` — Reference to the GameSettings object.
- `float playerViewX`
- `float playerViewY`
- `Entity pointedEntity`
- `TextureManager renderEngine`
- `double viewerPosX`
- `double viewerPosY`
- `double viewerPosZ`
- `World worldObj` — Reference to the World object.
