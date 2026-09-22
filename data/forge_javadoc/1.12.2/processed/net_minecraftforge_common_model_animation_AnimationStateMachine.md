# AnimationStateMachine

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.animation.AnimationStateMachine

## Class signature

```java
public final class AnimationStateMachine extends java.lang.Object implements IAnimationStateMachine
```

## Constructors

- `@Deprecated AnimationStateMachine(<any> parameters, <any> clips, <any> states, <any> transitions, java.lang.String startState)`
- `AnimationStateMachine(<any> parameters, <any> clips, <any> states, <any> transitions, java.lang.String startState)`

## Methods

- `<any> apply(float time)` — Sample the state and events at the current time.
- `java.lang.String currentState()` — Get current state name.
- `static AnimationStateMachine getMissing()`
- `static IAnimationStateMachine load(IResourceManager manager, ResourceLocation location, <any> customParameters)` — Load a new instance if AnimationStateMachine at specified location, with specified custom parameters.
- `void shouldHandleSpecialEvents(boolean value)` — Set to true if the machine should handle special events that come from the clips (they start with '!').
- `void transition(java.lang.String newState)` — Transition to a new state.