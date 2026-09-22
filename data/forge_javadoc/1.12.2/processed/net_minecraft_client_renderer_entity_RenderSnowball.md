# RenderSnowball

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RenderSnowball<T>

## Class signature

```java
public class RenderSnowball<T extends Entity> extends Render<T>
```

## Constructors

- `RenderSnowball(RenderManager renderManagerIn, Item itemIn, RenderItem itemRendererIn)`

## Methods

- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected ResourceLocation getEntityTexture(Entity entity)`
- `ItemStack getStackToRender(T entityIn)`

## Fields

- `protected Item item`