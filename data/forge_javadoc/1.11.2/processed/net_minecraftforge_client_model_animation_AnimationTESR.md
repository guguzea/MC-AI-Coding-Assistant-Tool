# AnimationTESR

## Class signature

```java
public class AnimationTESR<T extends TileEntity > extends FastTESR <T> implements IEventHandler <T>
```

## Constructors

- `public AnimationTESR()`

## Methods

- `public void renderTileEntityFast(@Nonnull T te, double x, double y, double z, float partialTick, int breakStage, @Nonnull VertexBuffer renderer)`
- `public void handleEvents( T te, float time, java.lang.Iterable< Event > pastEvents)`

## Description

Generic TileEntitySpecialRenderer that works with the Forge model system and animations.