# InputUpdateEvent

## Class signature

```java
public class InputUpdateEvent extends PlayerEvent
```

## Constructors

- `public InputUpdateEvent( EntityPlayer player, MovementInput movementInput)`

## Methods

- `public MovementInput getMovementInput()`

## Description

This event is fired after player movement inputs are updated. Handlers can freely manipulate MovementInput to cancel movement.