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