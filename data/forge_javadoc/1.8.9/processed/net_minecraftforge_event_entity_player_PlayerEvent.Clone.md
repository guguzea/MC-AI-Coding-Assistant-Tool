# PlayerEvent.Clone

## Constructors

- `public Clone( EntityPlayer _new, EntityPlayer oldPlayer, boolean wasDeath)`

## Description

Fired when the EntityPlayer is cloned, typically caused by the network sending a RESPAWN_PLAYER event. Either caused by death, or by traveling from the End to the overworld.