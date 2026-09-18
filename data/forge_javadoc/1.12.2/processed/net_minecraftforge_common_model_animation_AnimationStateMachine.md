# AnimationStateMachine

## Class signature

```java
public final class AnimationStateMachine extends java.lang.Object implements IAnimationStateMachine
```

## Constructors

- `public AnimationStateMachine(<any> parameters, <any> clips, <any> states, <any> transitions, java.lang.String startState)`

## Methods

- `@Deprecated public AnimationStateMachine(<any> parameters, <any> clips, <any> states, <any> transitions, java.lang.String startState)`
- `public <any> apply(float time)`
- `public void transition(java.lang.String newState)`
- `public java.lang.String currentState()`
- `public void shouldHandleSpecialEvents(boolean value)`
- `public static IAnimationStateMachine load( IResourceManager manager, ResourceLocation location, <any> customParameters)`
- `public static AnimationStateMachine getMissing()`

## Description

Deprecated.