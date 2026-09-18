# RenderSnowball

## Class signature

```java
public class RenderSnowball<T extends Entity > extends Render <T>
```

## Constructors

- `public RenderSnowball( RenderManager renderManagerIn, Item itemIn, RenderItem itemRendererIn)`

## Methods

- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public ItemStack getStackToRender( T entityIn)`
- `protected ResourceLocation getEntityTexture( Entity entity)`