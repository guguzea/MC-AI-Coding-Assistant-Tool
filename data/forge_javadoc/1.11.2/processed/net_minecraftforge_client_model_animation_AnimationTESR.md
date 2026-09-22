# AnimationTESR

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer<T> → net.minecraftforge.client.model.animation.FastTESR<T> → net.minecraftforge.client.model.animation.AnimationTESR<T>

## Class signature

```java
public class AnimationTESR<T extends TileEntity> extends FastTESR<T> implements IEventHandler<T>
```

## Constructors

- `AnimationTESR()`

## Methods

- `void handleEvents(T te, float time, java.lang.Iterable<Event> pastEvents)`
- `void renderTileEntityFast(T te, double x, double y, double z, float partialTick, int breakStage, VertexBuffer renderer)`

## Fields

- `protected static BlockRendererDispatcher blockRenderer`