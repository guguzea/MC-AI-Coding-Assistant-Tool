# PlacementSettings

## Class signature

```java
public class PlacementSettings extends java.lang.Object
```

## Constructors

- `public PlacementSettings()`

## Methods

- `public PlacementSettings copy()`
- `public PlacementSettings setMirror( Mirror mirrorIn)`
- `public PlacementSettings setRotation( Rotation rotationIn)`
- `public PlacementSettings setIgnoreEntities(boolean ignoreEntitiesIn)`
- `public PlacementSettings setReplacedBlock( Block replacedBlockIn)`
- `public PlacementSettings setChunk( ChunkPos chunkPosIn)`
- `public PlacementSettings setBoundingBox( StructureBoundingBox boundingBoxIn)`
- `public PlacementSettings setSeed(@Nullable java.lang.Long seedIn)`
- `public PlacementSettings setRandom(@Nullable java.util.Random randomIn)`
- `public PlacementSettings setIntegrity(float integrityIn)`
- `public Mirror getMirror()`
- `public PlacementSettings setIgnoreStructureBlock(boolean ignoreStructureBlockIn)`
- `public Rotation getRotation()`
- `public java.util.Random getRandom(@Nullable BlockPos p_189947_1_)`
- `public float getIntegrity()`
- `public boolean getIgnoreEntities()`
- `@Nullable public Block getReplacedBlock()`
- `@Nullable public StructureBoundingBox getBoundingBox()`
- `public boolean getIgnoreStructureBlock()`