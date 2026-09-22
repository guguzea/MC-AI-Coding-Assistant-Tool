---
title: "Clips.ClipReference"
description: "public static final class Clips.ClipReference extends java.lang.Object implements IClip, IStringSerializable"
package: "net/minecraftforge/common/model/animation"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/model/animation/Clips.ClipReference.html"
sourceType: javadoc
---

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
