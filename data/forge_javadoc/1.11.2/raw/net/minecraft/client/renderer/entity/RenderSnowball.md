---
title: "RenderSnowball"
description: "public class RenderSnowball<T extends Entity > extends Render <T>"
package: "net/minecraft/client/renderer/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/entity/RenderSnowball.html"
sourceType: javadoc
---

# RenderSnowball

## Class signature

```java
public class RenderSnowball<T extends Entity > extends Render <T>
```

## Constructors

- `public RenderSnowball( RenderManager renderManagerIn, Item itemIn, RenderItem itemRendererIn)`

## Methods

- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public ItemStack getStackToRender( T entityIn)`
- `protected ResourceLocation getEntityTexture( Entity entity)`
