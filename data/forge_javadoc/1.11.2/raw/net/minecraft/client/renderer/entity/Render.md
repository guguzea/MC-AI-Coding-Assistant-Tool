---
title: "Render"
description: "public abstract class Render<T extends Entity> extends java.lang.Object"
package: "net/minecraft/client/renderer/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/entity/Render.html"
sourceType: javadoc
---

# Render

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T>

## Class signature

```java
public abstract class Render<T extends Entity> extends java.lang.Object
```

## Constructors

- `Render(RenderManager renderManager)`

## Methods

- `protected boolean bindEntityTexture(T entity)`
- `void bindTexture(ResourceLocation location)`
- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `void doRenderShadowAndFire(Entity entityIn, double x, double y, double z, float yaw, float partialTicks)`
- `protected abstract ResourceLocation getEntityTexture(T entity)`
- `FontRenderer getFontRendererFromRenderManager()`
- `RenderManager getRenderManager()`
- `protected int getTeamColor(T entityIn)`
- `boolean isMultipass()`
- `protected void renderEntityName(T entityIn, double x, double y, double z, java.lang.String name, double distanceSq)`
- `protected void renderLivingLabel(T entityIn, java.lang.String str, double x, double y, double z, int maxDistance)`
- `void renderMultipass(T p_188300_1_, double p_188300_2_, double p_188300_4_, double p_188300_6_, float p_188300_8_, float p_188300_9_)`
- `protected void renderName(T entity, double x, double y, double z)`
- `static void renderOffsetAABB(AxisAlignedBB boundingBox, double x, double y, double z)`
- `void setRenderOutlines(boolean renderOutlinesIn)`
- `boolean shouldRender(T livingEntity, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `protected RenderManager renderManager`
- `protected boolean renderOutlines`
- `protected float shadowOpaque`
- `protected float shadowSize`
