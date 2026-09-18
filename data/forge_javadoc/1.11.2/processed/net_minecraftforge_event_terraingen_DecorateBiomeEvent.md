# DecorateBiomeEvent

## Class signature

```java
public class DecorateBiomeEvent extends Event
```

## Constructors

- `public DecorateBiomeEvent( World world, java.util.Random rand, BlockPos pos)`

## Methods

- `public World getWorld()`
- `public java.util.Random getRand()`
- `public BlockPos getPos()`

## Description

DecorateBiomeEvent is fired when a BiomeDecorator is created. This event is fired whenever a BiomeDecorator is created in DeferredBiomeDecorator.fireCreateEventAndReplace(Biome) . world contains the w