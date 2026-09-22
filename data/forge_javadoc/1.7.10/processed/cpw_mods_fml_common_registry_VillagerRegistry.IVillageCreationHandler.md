# VillagerRegistry.IVillageCreationHandler

## Class signature

```java
public static interface VillagerRegistry.IVillageCreationHandler
```

## Methods

- `java.lang.Object buildComponent(StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List pieces, java.util.Random random, int p1, int p2, int p3, int p4, int p5)` — Build an instance of the village component StructureVillagePieces
- `java.lang.Class<?> getComponentClass()` — The class of the root structure component to add to the village
- `StructureVillagePieces.PieceWeight getVillagePieceWeight(java.util.Random random, int i)` — Called when MapGenVillage is creating a new village