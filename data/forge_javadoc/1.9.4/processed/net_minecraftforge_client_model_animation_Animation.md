# Animation

**Inheritance:** java.lang.Object → java.lang.Enum<Animation> → net.minecraftforge.client.model.animation.Animation

## Class signature

```java
public enum Animation extends java.lang.Enum<Animation>
```

## Methods

- `static float getPartialTickTime()` — Get current partialTickTime.
- `static float getWorldTime(World world)` — Get the global world time for the current tick, in seconds.
- `static float getWorldTime(World world, float tickProgress)` — Get the global world time for the current tick + partial tick progress, in seconds.
- `static void setClientPartialTickTime(float clientPartialTickTime)` — Internal hook, do not use.
- `static Animation valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static Animation [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.