# ExplosionEvent

## Class signature

```java
public class ExplosionEvent extends Event
```

## Constructors

- `public ExplosionEvent( World world, Explosion explosion)`

## Description

ExplosionEvent triggers when an explosion happens in the world. ExplosionEvent.Start is fired before the explosion actually occurs. ExplosionEvent.Detonate is fired once the explosion has a list of af