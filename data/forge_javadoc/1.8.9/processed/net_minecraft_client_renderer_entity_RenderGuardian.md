# RenderGuardian

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T> → net.minecraft.client.renderer.entity.RenderLiving<EntityGuardian> → net.minecraft.client.renderer.entity.RenderGuardian

## Class signature

```java
public class RenderGuardian extends RenderLiving<EntityGuardian>
```

## Methods

- `void doRender(EntityGuardian entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected ResourceLocation getEntityTexture(EntityGuardian entity)` — Returns the location of an entity's texture.
- `protected void preRenderCallback(EntityGuardian entitylivingbaseIn, float partialTickTime)` — Allows the render to do any OpenGL state modifications necessary before the model is rendered.
- `boolean shouldRender(EntityGuardian livingEntity, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `RenderGuardian`