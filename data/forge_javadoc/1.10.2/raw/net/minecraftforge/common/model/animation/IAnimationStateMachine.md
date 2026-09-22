---
title: "IAnimationStateMachine"
description: "public interface IAnimationStateMachine"
package: "net/minecraftforge/common/model/animation"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/model/animation/IAnimationStateMachine.html"
sourceType: javadoc
---

# IAnimationStateMachine

## Class signature

```java
public interface IAnimationStateMachine
```

## Methods

- `org.apache.commons.lang3.tuple.Pair<IModelState, java.lang.Iterable<Event>> apply(float time)` — Sample the state and events at the current time.
- `java.lang.String currentState()` — Get current state name.
- `void shouldHandleSpecialEvents(boolean value)` — Set to true if the machine should handle special events that come from the clips (they start with '!').
- `void transition(java.lang.String newState)` — Transition to a new state.
