# DecorateBiomeEvent.Decorate

## Constructors

- `public Decorate( World world, java.util.Random rand, ChunkPos chunkPos, BlockPos placementPos, DecorateBiomeEvent.Decorate.EventType type)`

## Methods

- `@Deprecated public Decorate( World world, java.util.Random rand, BlockPos pos, DecorateBiomeEvent.Decorate.EventType type)`
- `public DecorateBiomeEvent.Decorate.EventType getType()`
- `public BlockPos getPlacementPos()`

## Description

This event is fired when a chunk is decorated with a biome feature. You can set the result to DENY to prevent the default biome decoration.