# Clips

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.animation.Clips

## Class signature

```java
public final class Clips extends java.lang.Object
```

## Constructors

- `Clips()`

## Methods

- `static org.apache.commons.lang3.tuple.Pair<IModelState, java.lang.Iterable<Event>> apply(IClip clip, float lastPollTime, float time)` — IModelState wrapper for a Clip, sampled at specified time.
- `static IClip getModelClipNode(ResourceLocation modelLocation, java.lang.String clipName)` — Retrieves the clip from the model.