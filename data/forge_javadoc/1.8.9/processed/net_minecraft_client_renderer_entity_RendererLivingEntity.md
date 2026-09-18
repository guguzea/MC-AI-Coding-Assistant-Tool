# RendererLivingEntity

## Class signature

```java
public abstract class RendererLivingEntity<T extends EntityLivingBase > extends Render <T>
```

## Constructors

- `public RendererLivingEntity( RenderManager renderManagerIn, ModelBase modelBaseIn, float shadowSizeIn)`

## Methods

- `public <V extends EntityLivingBase ,U extends LayerRenderer <V>> boolean addLayer(U layer)`
- `protected <V extends EntityLivingBase ,U extends LayerRenderer <V>> boolean removeLayer(U layer)`
- `public ModelBase getMainModel()`
- `protected float interpolateRotation(float par1, float par2, float par3)`
- `public void transformHeldFull3DItemLayer()`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected boolean setScoreTeamColor( T entityLivingBaseIn)`
- `protected void unsetScoreTeamColor()`
- `protected void renderModel( T entitylivingbaseIn, float p_77036_2_, float p_77036_3_, float p_77036_4_, float p_77036_5_, float p_77036_6_, float p_77036_7_)`
- `protected boolean setDoRenderBrightness( T entityLivingBaseIn, float partialTicks)`
- `protected boolean setBrightness( T entitylivingbaseIn, float partialTicks, boolean combineTextures)`
- `protected void unsetBrightness()`
- `protected void renderLivingAt( T entityLivingBaseIn, double x, double y, double z)`
- `protected void rotateCorpse( T bat, float p_77043_2_, float p_77043_3_, float partialTicks)`
- `protected float getSwingProgress( T livingBase, float partialTickTime)`
- `protected float handleRotationFloat( T livingBase, float partialTicks)`
- `protected void renderLayers( T entitylivingbaseIn, float p_177093_2_, float p_177093_3_, float partialTicks, float p_177093_5_, float p_177093_6_, float p_177093_7_, float p_177093_8_)`
- `protected float getDeathMaxRotation( T entityLivingBaseIn)`
- `protected int getColorMultiplier( T entitylivingbaseIn, float lightBrightness, float partialTickTime)`
- `protected void preRenderCallback( T entitylivingbaseIn, float partialTickTime)`
- `public void renderName( T entity, double x, double y, double z)`
- `protected boolean canRenderName( T entity)`
- `public void setRenderOutlines(boolean renderOutlinesIn)`

## Description

Actually renders the given argument.