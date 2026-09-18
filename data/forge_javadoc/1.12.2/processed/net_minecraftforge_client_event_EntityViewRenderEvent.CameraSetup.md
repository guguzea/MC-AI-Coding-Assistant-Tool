# EntityViewRenderEvent.CameraSetup

## Constructors

- `public CameraSetup( EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float yaw, float pitch, float roll)`

## Methods

- `public float getYaw()`
- `public void setYaw(float yaw)`
- `public float getPitch()`
- `public void setPitch(float pitch)`
- `public float getRoll()`
- `public void setRoll(float roll)`

## Description

Event that allows mods to alter the angles of the player's camera. Mainly useful for applying roll.