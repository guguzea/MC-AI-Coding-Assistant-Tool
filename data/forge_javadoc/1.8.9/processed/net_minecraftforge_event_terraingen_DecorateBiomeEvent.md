# DecorateBiomeEvent

## Class signature

```java
public class DecorateBiomeEvent extends Event
```

## Constructors

- `public DecorateBiomeEvent( World world, java.util.Random rand, BlockPos pos)`

## Description

DecorateBiomeEvent is fired when a BiomeDecorator is created. This event is fired whenever a BiomeDecorator is created in DeferredBiomeDecorator#fireCreateEventAndReplace(BiomeGenBase). world contains