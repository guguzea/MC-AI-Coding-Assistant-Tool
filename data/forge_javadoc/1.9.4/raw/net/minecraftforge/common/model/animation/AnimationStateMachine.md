---
title: "AnimationStateMachine"
description: "public final class AnimationStateMachine extends java.lang.Object implements IAnimationStateMachine"
package: "net/minecraftforge/common/model/animation"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/model/animation/AnimationStateMachine.html"
sourceType: javadoc
---

# AnimationStateMachine

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.animation.AnimationStateMachine

## Class signature

```java
public final class AnimationStateMachine extends java.lang.Object implements IAnimationStateMachine
```

## Constructors

- `@Deprecated AnimationStateMachine(com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue> parameters, com.google.common.collect.ImmutableMap<java.lang.String, IClip> clips, com.google.common.collect.ImmutableList<java.lang.String> states, com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> transitions, java.lang.String startState)`
- `AnimationStateMachine(com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue> parameters, com.google.common.collect.ImmutableMap<java.lang.String, IClip> clips, com.google.common.collect.ImmutableList<java.lang.String> states, com.google.common.collect.ImmutableMultimap<java.lang.String, java.lang.String> transitions, java.lang.String startState)`

## Methods

- `org.apache.commons.lang3.tuple.Pair<IModelState, java.lang.Iterable<Event>> apply(float time)` — Sample the state and events at the current time.
- `java.lang.String currentState()` — Get current state name.
- `static AnimationStateMachine getMissing()`
- `static IAnimationStateMachine load(IResourceManager manager, ResourceLocation location, com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue> customParameters)` — Load a new instance if AnimationStateMachine at specified location, with specified custom parameters.
- `void shouldHandleSpecialEvents(boolean value)` — Set to true if the machine should handle special events that come from the clips (they start with '!').
- `void transition(java.lang.String newState)` — Transition to a new state.
