---
title: "RenderLiving"
description: "public abstract class RenderLiving<T extends EntityLiving > extends RenderLivingBase <T>"
package: "net/minecraft/client/renderer/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/entity/RenderLiving.html"
sourceType: javadoc
---

# RenderLiving

## Class signature

```java
public abstract class RenderLiving<T extends EntityLiving > extends RenderLivingBase <T>
```

## Constructors

- `public RenderLiving( RenderManager rendermanagerIn, ModelBase modelbaseIn, float shadowsizeIn)`

## Methods

- `protected boolean canRenderName( T entity)`
- `public boolean shouldRender( T livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public void setLightmap( T entityLivingIn, float partialTicks)`
- `protected void renderLeash( T entityLivingIn, double x, double y, double z, float entityYaw, float partialTicks)`
