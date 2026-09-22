# RenderWitch

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T> → net.minecraft.client.renderer.entity.RenderLiving<EntityWitch> → net.minecraft.client.renderer.entity.RenderWitch

## Class signature

```java
public class RenderWitch extends RenderLiving<EntityWitch>
```

## Methods

- `void doRender(EntityWitch entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected ResourceLocation getEntityTexture(EntityWitch entity)` — Returns the location of an entity's texture.
- `protected void preRenderCallback(EntityWitch entitylivingbaseIn, float partialTickTime)` — Allows the render to do any OpenGL state modifications necessary before the model is rendered.
- `void transformHeldFull3DItemLayer()`

## Fields

- `RenderWitch`