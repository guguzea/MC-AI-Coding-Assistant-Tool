# IEntityAdditionalSpawnData

## Class signature

```java
public interface IEntityAdditionalSpawnData
```

## Methods

- `void writeSpawnData(io.netty.buffer.ByteBuf buffer)`
- `void readSpawnData(io.netty.buffer.ByteBuf additionalData)`

## Description

A interface for Entities that need extra information to be communicated between the server and client when they are spawned.