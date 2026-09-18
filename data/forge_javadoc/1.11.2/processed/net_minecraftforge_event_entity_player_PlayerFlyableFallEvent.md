# PlayerFlyableFallEvent

## Class signature

```java
public class PlayerFlyableFallEvent extends PlayerEvent
```

## Constructors

- `public PlayerFlyableFallEvent( EntityPlayer player, float distance, float multiplier)`

## Methods

- `public float getDistance()`
- `public void setDistance(float distance)`
- `public float getMultiplier()`
- `public void setMultiplier(float multiplier)`

## Description

Occurs when a player falls, but is able to fly. Doesn't need to be cancelable, this is mainly for notification purposes.