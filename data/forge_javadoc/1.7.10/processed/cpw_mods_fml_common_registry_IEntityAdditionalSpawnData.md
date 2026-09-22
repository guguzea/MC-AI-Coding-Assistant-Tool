# IEntityAdditionalSpawnData

## Class signature

```java
public interface IEntityAdditionalSpawnData
```

## Methods

- `void readSpawnData(ByteBuf additionalData)` — Called by the client when it receives a Entity spawn packet.
- `void writeSpawnData(ByteBuf buffer)` — Called by the server when constructing the spawn packet.