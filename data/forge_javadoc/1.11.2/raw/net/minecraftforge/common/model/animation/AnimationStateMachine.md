---
title: "AnimationStateMachine"
description: "Deprecated."
package: "net/minecraftforge/common/model/animation"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/model/animation/AnimationStateMachine.html"
sourceType: javadoc
---

# AnimationStateMachine

## Class signature

```java
public final class AnimationStateMachine extends java.lang.Object implements IAnimationStateMachine
```

## Constructors

- `public AnimationStateMachine(com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue > parameters, com.google.common.collect.ImmutableMap<java.lang.String, IClip > clips, com.google.common.collect.ImmutableList<java.lang.String> states, com.google.common.collect.ImmutableMultimap<java.lang.String,java.lang.String> transitions, java.lang.String startState)`

## Methods

- `@Deprecated public AnimationStateMachine(com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue > parameters, com.google.common.collect.ImmutableMap<java.lang.String, IClip > clips, com.google.common.collect.ImmutableList<java.lang.String> states, com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> transitions, java.lang.String startState)`
- `public org.apache.commons.lang3.tuple.Pair< IModelState ,java.lang.Iterable< Event >> apply(float time)`
- `public void transition(java.lang.String newState)`
- `public java.lang.String currentState()`
- `public void shouldHandleSpecialEvents(boolean value)`
- `public static IAnimationStateMachine load( IResourceManager manager, ResourceLocation location, com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue > customParameters)`
- `public static AnimationStateMachine getMissing()`

## Description

Deprecated.
