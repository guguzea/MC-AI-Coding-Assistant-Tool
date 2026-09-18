# WorldEvent

## Class signature

```java
public class WorldEvent extends Event
```

## Constructors

- `public WorldEvent( World world)`

## Methods

- `public World getWorld()`

## Description

WorldEvent is fired when an event involving the world occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. world contains the World this e