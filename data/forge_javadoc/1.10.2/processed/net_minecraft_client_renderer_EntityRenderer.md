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
- `static void drawNameplate(FontRenderer fontRendererIn, java.lang.String str, float x, float y, float z, int verticalShift, float viewerYaw, float viewerPitch, boolean isThirdPersonFrontal, boolean isSneaking)`
- `void enableLightmap()`
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