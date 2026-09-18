# ITeleporter

## Class signature

```java
public interface ITeleporter
```

## Methods

- `void placeEntity( World world, Entity entity, float yaw)`
- `default boolean isVanilla()`

## Description

Interface for handling the placement of entities during dimension change. An implementation of this interface can be used to place the entity in a safe location, or generate a return portal, for insta