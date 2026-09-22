---
title: "VillagerRegistry"
description: "public class VillagerRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/registry/VillagerRegistry.html"
sourceType: javadoc
---

# VillagerRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.VillagerRegistry

## Class signature

```java
public class VillagerRegistry extends java.lang.Object
```

## Methods

- `static void addExtraVillageComponents(java.util.List<StructureVillagePieces.PieceWeight> list, java.util.Random random, int i)`
- `@Deprecated static VillagerRegistry.VillagerProfession getById(int network)`
- `@Deprecated static int getId(VillagerRegistry.VillagerProfession prof)`
- `static StructureVillagePieces.Village getVillageComponent(StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List<StructureComponent> pieces, java.util.Random random, int p1, int p2, int p3, EnumFacing facing, int p5)`
- `static VillagerRegistry instance()`
- `static void onSetProfession(EntityVillager entity, int network)`
- `static void onSetProfession(EntityZombieVillager entity, int network)`
- `void registerVillageCreationHandler(VillagerRegistry.IVillageCreationHandler handler)` — Register a new village creation handler
- `static void setRandomProfession(EntityVillager entity, java.util.Random rand)` — Hook called when spawning a Villager, sets it's profession to a random registered profession.
- `static void setRandomProfession(EntityZombieVillager entity, java.util.Random rand)`

## Fields

- `static VillagerRegistry.VillagerProfession FARMER`
