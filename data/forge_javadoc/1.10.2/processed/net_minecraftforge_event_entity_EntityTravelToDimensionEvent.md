# EntityTravelToDimensionEvent

## Class signature

```java
public class EntityTravelToDimensionEvent extends EntityEvent
```

## Constructors

- `public EntityTravelToDimensionEvent( Entity entity, int dimension)`

## Methods

- `public int getDimension()`

## Description

EntityTravelToDimensionEvent is fired before an Entity travels to a dimension. dimension contains the id of the dimension the entity is traveling to. This event is Cancelable . If this event is cancel