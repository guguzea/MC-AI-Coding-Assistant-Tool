# RenderPlayer

## Class signature

```java
public class RenderPlayer extends RenderLivingBase < AbstractClientPlayer >
```

## Constructors

- `public RenderPlayer( RenderManager renderManager)`
- `public RenderPlayer( RenderManager renderManager, boolean useSmallArms)`

## Methods

- `public ModelPlayer getMainModel()`
- `public void doRender( AbstractClientPlayer entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected ResourceLocation getEntityTexture( AbstractClientPlayer entity)`
- `public void transformHeldFull3DItemLayer()`
- `protected void preRenderCallback( AbstractClientPlayer entitylivingbaseIn, float partialTickTime)`
- `protected void renderEntityName( AbstractClientPlayer entityIn, double x, double y, double z, java.lang.String name, double distanceSq)`
- `public void renderRightArm( AbstractClientPlayer clientPlayer)`
- `public void renderLeftArm( AbstractClientPlayer clientPlayer)`
- `protected void renderLivingAt( AbstractClientPlayer entityLivingBaseIn, double x, double y, double z)`
- `protected void rotateCorpse( AbstractClientPlayer entityLiving, float p_77043_2_, float p_77043_3_, float partialTicks)`