# IKeyConflictContext

## Class signature

```java
public interface IKeyConflictContext
```

## Methods

- `boolean isActive()`
- `boolean conflicts( IKeyConflictContext other)`

## Description

Defines the context that a KeyBinding is used. Key conflicts occur when a KeyBinding has the same IKeyConflictContext and has conflicting modifiers and keyCodes.