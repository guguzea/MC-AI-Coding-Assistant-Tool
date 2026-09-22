# ModelBlockAnimation.MBClip

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.animation.ModelBlockAnimation.MBClip

## Class signature

```java
protected static class ModelBlockAnimation.MBClip extends java.lang.Object implements IClip
```

## Constructors

- `MBClip(boolean loop, com.google.common.collect.ImmutableMap<java.lang.String, com.google.common.collect.ImmutableList<ModelBlockAnimation.MBVariableClip>> clips, com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> events)`

## Methods

- `IJointClip apply(IJoint joint)`
- `java.lang.Iterable<Event> pastEvents(float lastPollTime, float time)`