# RenderMinecart

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RenderMinecart<T>

## Class signature

```java
public class RenderMinecart<T extends EntityMinecart> extends Render<T>
```

## Constructors

- `RenderMinecart(RenderManager renderManagerIn)`

## Methods

- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected void func_180560_a(T minecart, float partialTicks, IBlockState state)`
- `protected ResourceLocation getEntityTexture(T entity)` — Returns the location of an entity's texture.

## Fields

- `protected ModelBase modelMinecart` — instance of ModelMinecart for rendering