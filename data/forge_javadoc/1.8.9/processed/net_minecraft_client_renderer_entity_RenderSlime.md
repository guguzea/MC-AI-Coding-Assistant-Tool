# RenderSlime

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T> → net.minecraft.client.renderer.entity.RenderLiving<EntitySlime> → net.minecraft.client.renderer.entity.RenderSlime

## Class signature

```java
public class RenderSlime extends RenderLiving<EntitySlime>
```

## Methods

- `void doRender(EntitySlime entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected ResourceLocation getEntityTexture(EntitySlime entity)` — Returns the location of an entity's texture.
- `protected void preRenderCallback(EntitySlime entitylivingbaseIn, float partialTickTime)` — Allows the render to do any OpenGL state modifications necessary before the model is rendered.

## Fields

- `RenderSlime`