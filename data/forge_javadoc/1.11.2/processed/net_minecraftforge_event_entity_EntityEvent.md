# EntityEvent

## Class signature

```java
public class EntityEvent extends Event
```

## Constructors

- `public EntityEvent( Entity entity)`

## Methods

- `public Entity getEntity()`

## Description

EntityEvent is fired when an event involving any Entity occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. entity contains the entity th