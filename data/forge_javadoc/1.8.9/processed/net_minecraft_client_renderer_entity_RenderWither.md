# RenderWither

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T> → net.minecraft.client.renderer.entity.RenderLiving<EntityWither> → net.minecraft.client.renderer.entity.RenderWither

## Class signature

```java
public class RenderWither extends RenderLiving<EntityWither>
```

## Methods

- `void doRender(EntityWither entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected ResourceLocation getEntityTexture(EntityWither entity)` — Returns the location of an entity's texture.
- `protected void preRenderCallback(EntityWither entitylivingbaseIn, float partialTickTime)` — Allows the render to do any OpenGL state modifications necessary before the model is rendered.

## Fields

- `RenderWither`