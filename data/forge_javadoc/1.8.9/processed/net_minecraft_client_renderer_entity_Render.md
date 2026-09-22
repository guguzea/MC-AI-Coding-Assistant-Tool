# Render

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T>

## Class signature

```java
public abstract class Render<T extends Entity> extends java.lang.Object
```

## Constructors

- `Render(RenderManager renderManager)`

## Methods

- `protected boolean bindEntityTexture(T entity)`
- `void bindTexture(ResourceLocation location)`
- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `void doRenderShadowAndFire(Entity entityIn, double x, double y, double z, float yaw, float partialTicks)` — Renders the entity's shadow and fire (if its on fire).
- `protected abstract ResourceLocation getEntityTexture(T entity)` — Returns the location of an entity's texture.
- `FontRenderer getFontRendererFromRenderManager()` — Returns the font renderer from the set render manager
- `RenderManager getRenderManager()`
- `protected void renderLivingLabel(T entityIn, java.lang.String str, double x, double y, double z, int maxDistance)` — Renders an entity's name above its head
- `protected void renderName(T entity, double x, double y, double z)`
- `static void renderOffsetAABB(AxisAlignedBB boundingBox, double x, double y, double z)` — Renders a white box with the bounds of the AABB translated by the offset.
- `protected void renderOffsetLivingLabel(T entityIn, double x, double y, double z, java.lang.String str, float p_177069_9_, double p_177069_10_)`
- `boolean shouldRender(T livingEntity, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `protected RenderManager renderManager`
- `protected float shadowOpaque` — Determines the darkness of the object's shadow.
- `protected float shadowSize`