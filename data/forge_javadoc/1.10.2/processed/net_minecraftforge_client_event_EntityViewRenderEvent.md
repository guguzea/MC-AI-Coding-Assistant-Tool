# EntityViewRenderEvent

## Class signature

```java
public abstract class EntityViewRenderEvent extends Event
```

## Constructors

- `public EntityViewRenderEvent( EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks)`

## Methods

- `public EntityRenderer getRenderer()`
- `public Entity getEntity()`
- `public IBlockState getState()`
- `public double getRenderPartialTicks()`

## Description

Event that hooks into EntityRenderer, allowing any feature to customize visual attributes the player sees.