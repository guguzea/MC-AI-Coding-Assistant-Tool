# RenderEntityItem

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<EntityItem> → net.minecraft.client.renderer.entity.RenderEntityItem

## Class signature

```java
public class RenderEntityItem extends Render<EntityItem>
```

## Methods

- `void doRender(EntityItem entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected int func_177078_a(ItemStack stack)`
- `protected ResourceLocation getEntityTexture(EntityItem entity)` — Returns the location of an entity's texture.
- `boolean shouldBob()` — Items should have a bob effect
- `boolean shouldSpreadItems()` — Items should spread out when rendered in 3d?

## Fields

- `RenderEntityItem`