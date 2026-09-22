---
title: "IAnimationStateMachine"
description: "public interface IAnimationStateMachine"
package: "net/minecraftforge/common/model/animation"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/model/animation/IAnimationStateMachine.html"
sourceType: javadoc
---

# IAnimationStateMachine

## Class signature

```java
public interface IAnimationStateMachine
```

## Methods

- `<any> apply(float time)` — Sample the state and events at the current time.
- `java.lang.String currentState()` — Get current state name.
- `void shouldHandleSpecialEvents(boolean value)` — Set to true if the machine should handle special events that come from the clips (they start with '!').
- `void transition(java.lang.String newState)` — Transition to a new state.
