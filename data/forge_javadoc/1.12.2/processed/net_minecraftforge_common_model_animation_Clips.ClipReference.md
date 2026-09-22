# Clips.ClipReference

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.animation.Clips.ClipReference

## Class signature

```java
public static final class Clips.ClipReference extends java.lang.Object implements IClip, IStringSerializable
```

## Constructors

- `ClipReference(java.lang.String clipName, java.util.function.Function<java.lang.String, IClip> clipResolver)`

## Methods

- `IJointClip apply(IJoint joint)`
- `boolean equals(java.lang.Object obj)`
- `java.lang.String getName()`
- `int hashCode()`
- `java.lang.Iterable<Event> pastEvents(float lastPollTime, float time)`