# RenderLivingBase

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RenderLivingBase<T>

## Class signature

```java
public abstract class RenderLivingBase<T extends EntityLivingBase> extends Render<T>
```

## Constructors

- `RenderLivingBase(RenderManager renderManagerIn, ModelBase modelBaseIn, float shadowSizeIn)`

## Methods

- `<V extends EntityLivingBase, U extends LayerRenderer<V>> boolean addLayer(U layer)`
- `protected void applyRotations(T entityLiving, float p_77043_2_, float p_77043_3_, float partialTicks)`
- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected int getColorMultiplier(T entitylivingbaseIn, float lightBrightness, float partialTickTime)`
- `protected float getDeathMaxRotation(T entityLivingBaseIn)`
- `ModelBase getMainModel()`
- `protected float getSwingProgress(T livingBase, float partialTickTime)`
- `protected float handleRotationFloat(T livingBase, float partialTicks)`
- `protected float interpolateRotation(float prevYawOffset, float yawOffset, float partialTicks)`
- `float prepareScale(T entitylivingbaseIn, float partialTicks)`
- `protected void preRenderCallback(T entitylivingbaseIn, float partialTickTime)`
- `protected void renderLayers(T entitylivingbaseIn, float limbSwing, float limbSwingAmount, float partialTicks, float ageInTicks, float netHeadYaw, float headPitch, float scaleIn)`
- `protected void renderLivingAt(T entityLivingBaseIn, double x, double y, double z)`
- `protected void renderModel(T entitylivingbaseIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor)`
- `void renderName(T entity, double x, double y, double z)`
- `protected boolean setBrightness(T entitylivingbaseIn, float partialTicks, boolean combineTextures)`
- `protected boolean setDoRenderBrightness(T entityLivingBaseIn, float partialTicks)`
- `protected boolean setScoreTeamColor(T entityLivingBaseIn)`
- `void transformHeldFull3DItemLayer()`
- `protected void unsetBrightness()`
- `protected void unsetScoreTeamColor()`

## Fields

- `protected java.nio.FloatBuffer brightnessBuffer`
- `protected java.util.List<LayerRenderer<T>> layerRenderers`
- `protected ModelBase mainModel`
- `static float NAME_TAG_RANGE`
- `static float NAME_TAG_RANGE_SNEAK`
- `protected boolean renderMarker`