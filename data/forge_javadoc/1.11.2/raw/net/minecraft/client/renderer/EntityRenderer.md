---
title: "EntityRenderer"
description: "public class EntityRenderer extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/EntityRenderer.html"
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

- `void disableLightmap()`
- `void displayItemActivation(ItemStack p_190565_1_)`
- `static void drawNameplate(FontRenderer fontRendererIn, java.lang.String str, float x, float y, float z, int verticalShift, float viewerYaw, float viewerPitch, boolean isThirdPersonFrontal, boolean isSneaking)`
- `void enableLightmap()`
- `void func_191514_d(boolean p_191514_1_)`
- `MapItemRenderer getMapItemRenderer()`
- `void getMouseOver(float partialTicks)`
- `ShaderGroup getShaderGroup()`
- `boolean isShaderActive()`
- `void loadEntityShader(Entity entityIn)`
- `void loadShader(ResourceLocation resourceLocationIn)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected void renderRainSnow(float partialTicks)`
- `void renderStreamIndicator(float partialTicks)`
- `void renderWorld(float partialTicks, long finishTimeNano)`
- `void resetData()`
- `void setupOverlayRendering()`
- `void stopUseShader()`
- `void switchUseShader()`
- `void updateCameraAndRender(float partialTicks, long nanoTime)`
- `void updateRenderer()`
- `void updateShaderGroupSize(int width, int height)`

## Fields

- `static boolean anaglyphEnable`
- `static int anaglyphField`
- `ItemRenderer itemRenderer`
- `static int SHADER_COUNT`
