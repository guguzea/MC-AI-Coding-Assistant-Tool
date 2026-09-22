# RenderPlayerEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.client.event.RenderPlayerEvent

## Class signature

```java
public abstract class RenderPlayerEvent extends PlayerEvent
```

## Constructors

- `RenderPlayerEvent(EntityPlayer player, RenderPlayer renderer, float partialRenderTick, double x, double y, double z)`

## Fields

- `float partialRenderTick`
- `RenderPlayer renderer`
- `double x`
- `double y`
- `double z`