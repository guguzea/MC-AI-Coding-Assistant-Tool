# WorldRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.WorldRenderer

## Class signature

```java
public class WorldRenderer extends java.lang.Object
```

## Constructors

- `WorldRenderer(World p_i1240_1_, java.util.List p_i1240_2_, int p_i1240_3_, int p_i1240_4_, int p_i1240_5_, int p_i1240_6_)`

## Methods

- `void callOcclusionQueryList()`
- `float distanceToEntitySquared(Entity p_78912_1_)`
- `int getGLCallListForPass(int p_78909_1_)`
- `void markDirty()`
- `void setDontDraw()`
- `void setPosition(int p_78913_1_, int p_78913_2_, int p_78913_3_)`
- `boolean skipAllRenderPasses()`
- `void stopRendering()`
- `void updateInFrustum(ICamera p_78908_1_)`
- `void updateRenderer(EntityLivingBase p_147892_1_)`
- `void updateRendererSort(EntityLivingBase p_147889_1_)`

## Fields

- `int chunkIndex`
- `static int chunksUpdated`
- `int glOcclusionQuery`
- `boolean isChunkLit`
- `boolean isInFrustum`
- `boolean isVisible`
- `boolean isWaitingOnOcclusionQuery`
- `boolean needsUpdate`
- `int posX`
- `int posXClip`
- `int posXMinus`
- `int posXPlus`
- `int posY`
- `int posYClip`
- `int posYMinus`
- `int posYPlus`
- `int posZ`
- `int posZClip`
- `int posZMinus`
- `int posZPlus`
- `AxisAlignedBB rendererBoundingBox`
- `boolean[] skipRenderPass`
- `java.util.List tileEntityRenderers`
- `World worldObj`