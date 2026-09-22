# EntityRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.EntityRenderer

## Class signature

```java
public class EntityRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `EntityRenderer(Minecraft p_i45076_1_, IResourceManager p_i45076_2_)`

## Methods

- `void activateNextShader()`
- `void deactivateShader()`
- `void disableLightmap(double p_78483_1_)`
- `void enableLightmap(double p_78463_1_)`
- `void func_152430_c(float p_152430_1_)`
- `MapItemRenderer getMapItemRenderer()`
- `void getMouseOver(float p_78473_1_)`
- `ShaderGroup getShaderGroup()`
- `boolean isShaderActive()`
- `void onResourceManagerReload(IResourceManager p_110549_1_)`
- `protected void renderRainSnow(float p_78474_1_)`
- `void renderWorld(float p_78471_1_, long p_78471_2_)`
- `void setupOverlayRendering()`
- `void updateCameraAndRender(float p_78480_1_)`
- `void updateRenderer()`
- `void updateShaderGroupSize(int p_147704_1_, int p_147704_2_)`

## Fields

- `static boolean anaglyphEnable`
- `static int anaglyphField`
- `int debugViewDirection`
- `ItemRenderer itemRenderer`
- `static int shaderCount`
- `ShaderGroup theShaderGroup`