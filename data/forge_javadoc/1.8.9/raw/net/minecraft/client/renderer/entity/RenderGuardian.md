---
title: "RenderGuardian"
description: "Actually renders the given argument."
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderGuardian.html"
sourceType: javadoc
---

# RenderGuardian

## Class signature

```java
public class RenderGuardian extends RenderLiving < EntityGuardian >
```

## Constructors

- `public RenderGuardian( RenderManager renderManagerIn)`

## Methods

- `public boolean shouldRender( EntityGuardian livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( EntityGuardian entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected void preRenderCallback( EntityGuardian entitylivingbaseIn, float partialTickTime)`
- `protected ResourceLocation getEntityTexture( EntityGuardian entity)`

## Description

Actually renders the given argument.
