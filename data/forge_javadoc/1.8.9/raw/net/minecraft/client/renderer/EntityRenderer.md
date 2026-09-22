---
title: "EntityRenderer"
description: "public class EntityRenderer extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/EntityRenderer.html"
sourceType: javadoc
---

# EntityRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.EntityRenderer

## Class signature

```java
public class EntityRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `EntityRenderer(Minecraft mcIn, IResourceManager resourceManagerIn)`

## Methods

- `void activateNextShader()`
- `void disableLightmap()`
- `void enableLightmap()`
- `MapItemRenderer getMapItemRenderer()`
- `void getMouseOver(float partialTicks)` — Finds what block or object the mouse is over at the specified partial tick time.
- `ShaderGroup getShaderGroup()`
- `boolean isShaderActive()`
- `void loadEntityShader(Entity entityIn)` — What shader to use when spectating this entity
- `void loadShader(ResourceLocation resourceLocationIn)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected void renderRainSnow(float partialTicks)` — Render rain and snow
- `void renderStreamIndicator(float partialTicks)`
- `void renderWorld(float partialTicks, long finishTimeNano)`
- `void setupOverlayRendering()` — Setup orthogonal projection for rendering GUI screen overlays
- `void stopUseShader()`
- `void switchUseShader()`
- `void updateCameraAndRender(float p_181560_1_, long p_181560_2_)`
- `void updateRenderer()` — Updates the entity renderer
- `void updateShaderGroupSize(int width, int height)`

## Fields

- `static boolean anaglyphEnable`
- `static int anaglyphField` — Anaglyph field (0=R, 1=GB)
- `ItemRenderer itemRenderer`
- `static int shaderCount`
