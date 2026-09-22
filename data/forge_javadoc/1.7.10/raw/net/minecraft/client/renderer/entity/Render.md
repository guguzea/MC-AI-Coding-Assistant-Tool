---
title: "Render"
description: "public abstract class Render extends java.lang.Object"
package: "net/minecraft/client/renderer/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/renderer/entity/Render.html"
sourceType: javadoc
---

# Render

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render

## Class signature

```java
public abstract class Render extends java.lang.Object
```

## Constructors

- `Render()`

## Methods

- `protected void bindEntityTexture(Entity p_110777_1_)`
- `protected void bindTexture(ResourceLocation p_110776_1_)`
- `abstract void doRender(Entity p_76986_1_, double p_76986_2_, double p_76986_4_, double p_76986_6_, float p_76986_8_, float p_76986_9_)`
- `void doRenderShadowAndFire(Entity p_76979_1_, double p_76979_2_, double p_76979_4_, double p_76979_6_, float p_76979_8_, float p_76979_9_)`
- `protected void func_147906_a(Entity p_147906_1_, java.lang.String p_147906_2_, double p_147906_3_, double p_147906_5_, double p_147906_7_, int p_147906_9_)`
- `protected abstract ResourceLocation getEntityTexture(Entity p_110775_1_)`
- `FontRenderer getFontRendererFromRenderManager()`
- `boolean isStaticEntity()`
- `static void renderAABB(AxisAlignedBB p_76980_0_)`
- `static void renderOffsetAABB(AxisAlignedBB p_76978_0_, double p_76978_1_, double p_76978_3_, double p_76978_5_)`
- `void setRenderManager(RenderManager p_76976_1_)`
- `void updateIcons(IIconRegister p_94143_1_)`

## Fields

- `protected RenderBlocks field_147909_c`
- `protected RenderManager renderManager`
- `protected float shadowOpaque`
- `protected float shadowSize`
