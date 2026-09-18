---
title: "EntityRenderer"
description: "public class EntityRenderer extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/EntityRenderer.html"
sourceType: javadoc
---

# EntityRenderer

## Class signature

```java
public class EntityRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public EntityRenderer( Minecraft mcIn, IResourceManager resourceManagerIn)`

## Methods

- `public boolean isShaderActive()`
- `public void stopUseShader()`
- `public void switchUseShader()`
- `public void loadEntityShader(@Nullable Entity entityIn)`
- `public void loadShader( ResourceLocation resourceLocationIn)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public void updateRenderer()`
- `public ShaderGroup getShaderGroup()`
- `public void updateShaderGroupSize(int width, int height)`
- `public void getMouseOver(float partialTicks)`
- `public void disableLightmap()`
- `public void enableLightmap()`
- `public void updateCameraAndRender(float partialTicks, long nanoTime)`
- `public void renderStreamIndicator(float partialTicks)`
- `public void renderWorld(float partialTicks, long finishTimeNano)`
- `protected void renderRainSnow(float partialTicks)`
- `public void setupOverlayRendering()`
- `public void func_191514_d(boolean p_191514_1_)`
- `public void resetData()`
- `public MapItemRenderer getMapItemRenderer()`
- `public static void drawNameplate( FontRenderer fontRendererIn, java.lang.String str, float x, float y, float z, int verticalShift, float viewerYaw, float viewerPitch, boolean isThirdPersonFrontal, boolean isSneaking)`
- `public void displayItemActivation( ItemStack p_190565_1_)`
