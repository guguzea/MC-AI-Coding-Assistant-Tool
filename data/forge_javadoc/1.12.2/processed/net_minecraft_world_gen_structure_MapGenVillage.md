# MapGenVillage

## Class signature

```java
public class MapGenVillage extends MapGenStructure
```

## Constructors

- `public MapGenVillage()`
- `public MapGenVillage(java.util.Map<java.lang.String,java.lang.String> map)`

## Methods

- `public java.lang.String getStructureName()`
- `protected boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `public BlockPos getNearestStructurePos( World worldIn, BlockPos pos, boolean findUnexplored)`
- `protected StructureStart getStructureStart(int chunkX, int chunkZ)`