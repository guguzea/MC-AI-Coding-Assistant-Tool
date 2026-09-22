---
title: "Clips.ClipReference"
description: "public static final class Clips.ClipReference extends java.lang.Object implements IClip, IStringSerializable"
package: "net/minecraftforge/common/model/animation"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/model/animation/Clips.ClipReference.html"
sourceType: javadoc
---

# Clips.ClipReference

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.animation.Clips.ClipReference

## Class signature

```java
public static final class Clips.ClipReference extends java.lang.Object implements IClip, IStringSerializable
```

## Constructors

- `ClipReference(java.lang.String clipName, com.google.common.base.Function<java.lang.String, IClip> clipResolver)`

## Methods

- `IJointClip apply(IJoint joint)`
- `boolean equals(java.lang.Object obj)`
- `java.lang.String getName()`
- `int hashCode()`
- `java.lang.Iterable<Event> pastEvents(float lastPollTime, float time)`
