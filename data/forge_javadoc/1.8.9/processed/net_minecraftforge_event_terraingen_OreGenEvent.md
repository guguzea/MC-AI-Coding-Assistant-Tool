# OreGenEvent

## Class signature

```java
public class OreGenEvent extends Event
```

## Constructors

- `public OreGenEvent( World world, java.util.Random rand, BlockPos pos)`

## Description

OreGenEvent is fired when an event involving ore generation occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. world contains the world