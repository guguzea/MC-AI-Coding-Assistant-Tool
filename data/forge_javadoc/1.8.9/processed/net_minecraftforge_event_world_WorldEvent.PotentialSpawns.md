# WorldEvent.PotentialSpawns

## Constructors

- `public PotentialSpawns( World world, EnumCreatureType type, BlockPos pos, java.util.List< BiomeGenBase.SpawnListEntry > oldList)`

## Description

Called by WorldServer to gather a list of all possible entities that can spawn at the specified location. If an entry is added to the list, it needs to be a globally unique instance. The event is call