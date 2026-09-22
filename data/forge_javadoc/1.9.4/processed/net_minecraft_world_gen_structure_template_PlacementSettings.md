# PlacementSettings

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.template.PlacementSettings

## Class signature

```java
public class PlacementSettings extends java.lang.Object
```

## Constructors

- `PlacementSettings()`
- `PlacementSettings(Mirror mirrorIn, Rotation rotationIn, boolean ignoreEntitiesIn, Block replacedBlockIn, StructureBoundingBox boundingBoxIn)`

## Methods

- `PlacementSettings copy()`
- `StructureBoundingBox getBoundingBox()`
- `boolean getIgnoreEntities()`
- `boolean getIgnoreStructureBlock()`
- `Mirror getMirror()`
- `Block getReplacedBlock()`
- `Rotation getRotation()`
- `PlacementSettings setBoundingBox(StructureBoundingBox boundingBoxIn)`
- `PlacementSettings setChunk(ChunkPos chunkPosIn)`
- `PlacementSettings setIgnoreEntities(boolean ignoreEntitiesIn)`
- `PlacementSettings setIgnoreStructureBlock(boolean ignoreStructureBlockIn)`
- `PlacementSettings setMirror(Mirror mirrorIn)`
- `PlacementSettings setReplacedBlock(Block replacedBlockIn)`
- `PlacementSettings setRotation(Rotation rotationIn)`