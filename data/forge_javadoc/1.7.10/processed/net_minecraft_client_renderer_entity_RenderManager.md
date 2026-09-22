# RenderManager

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.RenderManager

## Class signature

```java
public class RenderManager extends java.lang.Object
```

## Methods

- `void cacheActiveRenderInfo(World p_147938_1_, TextureManager p_147938_2_, FontRenderer p_147938_3_, EntityLivingBase p_147938_4_, Entity p_147938_5_, GameSettings p_147938_6_, float p_147938_7_)`
- `boolean func_147939_a(Entity p_147939_1_, double p_147939_2_, double p_147939_4_, double p_147939_6_, float p_147939_8_, float p_147939_9_, boolean p_147939_10_)`
- `double getDistanceToCamera(double p_78714_1_, double p_78714_3_, double p_78714_5_)`
- `Render getEntityClassRenderObject(java.lang.Class p_78715_1_)`
- `Render getEntityRenderObject(Entity p_78713_1_)`
- `FontRenderer getFontRenderer()`
- `boolean renderEntitySimple(Entity p_147937_1_, float p_147937_2_)`
- `boolean renderEntityStatic(Entity p_147936_1_, float p_147936_2_, boolean p_147936_3_)`
- `boolean renderEntityWithPosYaw(Entity p_147940_1_, double p_147940_2_, double p_147940_4_, double p_147940_6_, float p_147940_8_, float p_147940_9_)`
- `void set(World p_78717_1_)`
- `void updateIcons(IIconRegister p_94178_1_)`

## Fields

- `static boolean debugBoundingBox`
- `java.util.Map entityRenderMap`
- `Entity field_147941_i`
- `static RenderManager instance`
- `ItemRenderer itemRenderer`
- `EntityLivingBase livingPlayer`
- `GameSettings options`
- `float playerViewX`
- `float playerViewY`
- `TextureManager renderEngine`
- `static double renderPosX`
- `static double renderPosY`
- `static double renderPosZ`
- `double viewerPosX`
- `double viewerPosY`
- `double viewerPosZ`
- `World worldObj`