# EntityViewRenderEvent.FogDensity

## Constructors

- `public FogDensity( EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float density)`

## Methods

- `public float getDensity()`
- `public void setDensity(float density)`

## Description

Event that allows any feature to customize the fog density the player sees. NOTE: In order to make this event have an effect, you must cancel the event