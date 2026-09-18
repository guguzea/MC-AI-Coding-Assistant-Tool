# ChunkDataEvent

## Class signature

```java
public class ChunkDataEvent extends ChunkEvent
```

## Constructors

- `public ChunkDataEvent( Chunk chunk, NBTTagCompound data)`

## Methods

- `public NBTTagCompound getData()`

## Description

ChunkDataEvent is fired when an event involving chunk data occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. data contains the NBTTagCo