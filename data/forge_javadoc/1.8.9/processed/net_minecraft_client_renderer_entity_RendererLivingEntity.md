# RendererLivingEntity

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T>

## Class signature

```java
public abstract class RendererLivingEntity<T extends EntityLivingBase> extends Render<T>
```

## Constructors

- `RendererLivingEntity(RenderManager renderManagerIn, ModelBase modelBaseIn, float shadowSizeIn)`

## Methods

- `<V extends EntityLivingBase, U extends LayerRenderer<V>> boolean addLayer(U layer)`
- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected int getColorMultiplier(T entitylivingbaseIn, float lightBrightness, float partialTickTime)` — Returns an ARGB int color back.
- `protected float getDeathMaxRotation(T entityLivingBaseIn)`
- `ModelBase getMainModel()`
- `protected float getSwingProgress(T livingBase, float partialTickTime)` — Returns where in the swing animation the living entity is (from 0 to 1).
- `protected float handleRotationFloat(T livingBase, float partialTicks)` — Defines what float the third param in setRotationAngles of ModelBase is
- `protected float interpolateRotation(float par1, float par2, float par3)` — Returns a rotation angle that is inbetween two other rotation angles. par1 and par2 are the angles between which to interpolate, par3 is probably a float between 0.0 and 1.0 that tells us where "between" the two angles we are.
- `protected void preRenderCallback(T entitylivingbaseIn, float partialTickTime)` — Allows the render to do any OpenGL state modifications necessary before the model is rendered.
- `protected<V extends EntityLivingBase, U extends LayerRenderer<V>> boolean removeLayer(U layer)`
- `protected void renderLayers(T entitylivingbaseIn, float p_177093_2_, float p_177093_3_, float partialTicks, float p_177093_5_, float p_177093_6_, float p_177093_7_, float p_177093_8_)`
- `protected void renderLivingAt(T entityLivingBaseIn, double x, double y, double z)` — Sets a simple glTranslate on a LivingEntity.
- `protected void renderModel(T entitylivingbaseIn, float p_77036_2_, float p_77036_3_, float p_77036_4_, float p_77036_5_, float p_77036_6_, float p_77036_7_)` — Renders the model in RenderLiving
- `void renderName(T entity, double x, double y, double z)`
- `protected void rotateCorpse(T bat, float p_77043_2_, float p_77043_3_, float partialTicks)`
- `protected boolean setBrightness(T entitylivingbaseIn, float partialTicks, boolean combineTextures)`
- `protected boolean setDoRenderBrightness(T entityLivingBaseIn, float partialTicks)`
- `void setRenderOutlines(boolean renderOutlinesIn)`
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
- `protected boolean renderOutlines`