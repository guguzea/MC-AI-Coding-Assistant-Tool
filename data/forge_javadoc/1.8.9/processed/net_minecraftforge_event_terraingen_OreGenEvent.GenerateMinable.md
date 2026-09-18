# OreGenEvent.GenerateMinable

## Constructors

- `public GenerateMinable( World world, java.util.Random rand, WorldGenerator generator, BlockPos pos, OreGenEvent.GenerateMinable.EventType type)`

## Description

GenerateMinable is fired when a mineable block is generated in a chunk. This event is fired just after ore generation in BiomeDecorator#generateOres(). type contains the enum value for the Ore attempt