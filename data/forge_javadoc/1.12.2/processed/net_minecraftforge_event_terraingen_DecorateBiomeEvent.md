# DecorateBiomeEvent

## Class signature

```java
public class DecorateBiomeEvent extends Event
```

## Constructors

- `public DecorateBiomeEvent( World world, java.util.Random rand, ChunkPos chunkPos)`

## Methods

- `@Deprecated public DecorateBiomeEvent( World world, java.util.Random rand, BlockPos pos)`
- `public World getWorld()`
- `public java.util.Random getRand()`
- `@Deprecated public BlockPos getPos()`
- `public ChunkPos getChunkPos()`

## Description

DecorateBiomeEvent is fired when a BiomeDecorator is created. This event is fired whenever a BiomeDecorator is created in DeferredBiomeDecorator.fireCreateEventAndReplace(Biome) . world contains the w