# RenderManager

## Class signature

```java
public class RenderManager extends java.lang.Object
```

## Constructors

- `public RenderManager( TextureManager renderEngineIn, RenderItem itemRendererIn)`

## Methods

- `public java.util.Map<java.lang.String, RenderPlayer > getSkinMap()`
- `public void setRenderPosition(double renderPosXIn, double renderPosYIn, double renderPosZIn)`
- `public <T extends Entity > Render <T> getEntityClassRenderObject(java.lang.Class<? extends Entity > p_78715_1_)`
- `public <T extends Entity > Render <T> getEntityRenderObject( Entity entityIn)`
- `public void cacheActiveRenderInfo( World worldIn, FontRenderer textRendererIn, Entity livingPlayerIn, Entity pointedEntityIn, GameSettings optionsIn, float partialTicks)`
- `public void setPlayerViewY(float playerViewYIn)`
- `public boolean isRenderShadow()`
- `public void setRenderShadow(boolean renderShadowIn)`
- `public void setDebugBoundingBox(boolean debugBoundingBoxIn)`
- `public boolean isDebugBoundingBox()`
- `public boolean renderEntitySimple( Entity entityIn, float partialTicks)`
- `public boolean shouldRender( Entity entityIn, ICamera camera, double camX, double camY, double camZ)`
- `public boolean renderEntityStatic( Entity entity, float partialTicks, boolean p_147936_3_)`
- `public void renderWitherSkull( Entity entityIn, float partialTicks)`
- `public boolean renderEntityWithPosYaw( Entity entityIn, double x, double y, double z, float entityYaw, float partialTicks)`
- `public boolean doRenderEntity( Entity entity, double x, double y, double z, float entityYaw, float partialTicks, boolean p_147939_10_)`
- `public void set( World worldIn)`
- `public double getDistanceToCamera(double p_78714_1_, double p_78714_3_, double p_78714_5_)`
- `public FontRenderer getFontRenderer()`
- `public void setRenderOutlines(boolean renderOutlinesIn)`

## Description

Rendermanager's variable for the player