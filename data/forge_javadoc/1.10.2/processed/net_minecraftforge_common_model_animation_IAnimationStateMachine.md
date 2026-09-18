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