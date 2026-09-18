# EntityViewRenderEvent.FOVModifier

## Constructors

- `public FOVModifier( EntityRenderer renderer, Entity entity, Block block, double renderPartialTicks, float fov)`

## Methods

- `public float getFOV()`
- `public void setFOV(float fov)`

## Description

Event that allows mods to alter the raw FOV itself. This directly affects to the FOV without being modified.