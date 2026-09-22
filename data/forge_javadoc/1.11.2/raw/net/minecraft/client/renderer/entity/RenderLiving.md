---
title: "RenderLiving"
description: "public abstract class RenderLiving<T extends EntityLiving> extends RenderLivingBase<T>"
package: "net/minecraft/client/renderer/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/entity/RenderLiving.html"
sourceType: javadoc
---

# RenderLiving

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RenderLivingBase<T> → net.minecraft.client.renderer.entity.RenderLiving<T>

## Class signature

```java
public abstract class RenderLiving<T extends EntityLiving> extends RenderLivingBase<T>
```

## Methods

- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected void renderLeash(T entityLivingIn, double x, double y, double z, float entityYaw, float partialTicks)`
- `void setLightmap(T entityLivingIn, float partialTicks)`
- `boolean shouldRender(T livingEntity, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `RenderLiving`
