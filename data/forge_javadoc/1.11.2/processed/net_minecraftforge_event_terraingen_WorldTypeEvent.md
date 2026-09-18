# WorldTypeEvent

## Class signature

```java
public class WorldTypeEvent extends Event
```

## Constructors

- `public WorldTypeEvent( WorldType worldType)`

## Methods

- `public WorldType getWorldType()`

## Description

WorldTypeEvent is fired when an event involving the world occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. worldType contains the Worl