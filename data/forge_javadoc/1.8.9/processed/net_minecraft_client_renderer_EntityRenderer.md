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
- `public void loadEntityShader( Entity entityIn)`
- `public void activateNextShader()`
- `public void loadShader( ResourceLocation resourceLocationIn)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public void updateRenderer()`
- `public ShaderGroup getShaderGroup()`
- `public void updateShaderGroupSize(int width, int height)`
- `public void getMouseOver(float partialTicks)`
- `public void disableLightmap()`
- `public void enableLightmap()`
- `public void updateCameraAndRender(float p_181560_1_, long p_181560_2_)`
- `public void renderStreamIndicator(float partialTicks)`
- `public void renderWorld(float partialTicks, long finishTimeNano)`
- `protected void renderRainSnow(float partialTicks)`
- `public void setupOverlayRendering()`
- `public MapItemRenderer getMapItemRenderer()`

## Description

Anaglyph field (0=R, 1=GB)