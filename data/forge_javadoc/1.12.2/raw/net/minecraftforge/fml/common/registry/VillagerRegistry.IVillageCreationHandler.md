---
title: "VillagerRegistry.IVillageCreationHandler"
description: "public static interface VillagerRegistry.IVillageCreationHandler"
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/registry/VillagerRegistry.IVillageCreationHandler.html"
sourceType: javadoc
---

# VillagerRegistry.IVillageCreationHandler

## Class signature

```java
public static interface VillagerRegistry.IVillageCreationHandler
```

## Methods

- `StructureVillagePieces.Village buildComponent(StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List<StructureComponent> pieces, java.util.Random random, int p1, int p2, int p3, EnumFacing facing, int p5)` — Build an instance of the village component StructureVillagePieces
- `java.lang.Class<?> getComponentClass()` — The class of the root structure component to add to the village
- `StructureVillagePieces.PieceWeight getVillagePieceWeight(java.util.Random random, int i)` — Called when MapGenVillage is creating a new village
