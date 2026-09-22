---
title: "RenderLiving"
description: "public abstract class RenderLiving<T extends EntityLiving> extends RendererLivingEntity<T>"
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderLiving.html"
sourceType: javadoc
---

# RenderLiving

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T> → net.minecraft.client.renderer.entity.RenderLiving<T>

## Class signature

```java
public abstract class RenderLiving<T extends EntityLiving> extends RendererLivingEntity<T>
```

## Methods

- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `void func_177105_a(T entityLivingIn, float partialTicks)`
- `protected void renderLeash(T entityLivingIn, double x, double y, double z, float entityYaw, float partialTicks)`
- `boolean shouldRender(T livingEntity, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `RenderLiving`
