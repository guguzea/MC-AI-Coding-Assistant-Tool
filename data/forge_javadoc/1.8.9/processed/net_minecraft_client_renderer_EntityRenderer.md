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