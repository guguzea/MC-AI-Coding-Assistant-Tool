---
title: "IAnimationStateMachine"
description: "State machine representing the model animation."
package: "net/minecraftforge/common/model/animation"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/model/animation/IAnimationStateMachine.html"
sourceType: javadoc
---

# IAnimationStateMachine

## Class signature

```java
public interface IAnimationStateMachine
```

## Methods

- `org.apache.commons.lang3.tuple.Pair< IModelState ,java.lang.Iterable< Event >> apply(float time)`
- `void transition(java.lang.String newState)`
- `java.lang.String currentState()`
- `void shouldHandleSpecialEvents(boolean value)`

## Description

State machine representing the model animation.
