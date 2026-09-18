---
title: "RenderLiving"
description: "Actually renders the given argument."
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderLiving.html"
sourceType: javadoc
---

# RenderLiving

## Class signature

```java
public abstract class RenderLiving<T extends EntityLiving > extends RendererLivingEntity <T>
```

## Constructors

- `public RenderLiving( RenderManager rendermanagerIn, ModelBase modelbaseIn, float shadowsizeIn)`

## Methods

- `protected boolean canRenderName( T entity)`
- `public boolean shouldRender( T livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public void func_177105_a( T entityLivingIn, float partialTicks)`
- `protected void renderLeash( T entityLivingIn, double x, double y, double z, float entityYaw, float partialTicks)`

## Description

Actually renders the given argument.
