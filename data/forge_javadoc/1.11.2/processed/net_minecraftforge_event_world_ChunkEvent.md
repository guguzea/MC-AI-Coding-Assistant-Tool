# ChunkEvent

## Class signature

```java
public class ChunkEvent extends WorldEvent
```

## Constructors

- `public ChunkEvent( Chunk chunk)`

## Methods

- `public Chunk getChunk()`

## Description

ChunkEvent is fired when an event involving a chunk occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. chunk contains the Chunk this eve