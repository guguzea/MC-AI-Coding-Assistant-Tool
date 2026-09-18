# VillagerRegistry

## Class signature

```java
public class VillagerRegistry extends java.lang.Object
```

## Methods

- `public static VillagerRegistry instance()`
- `public void registerVillageCreationHandler( VillagerRegistry.IVillageCreationHandler handler)`
- `public static void addExtraVillageComponents(java.util.List< StructureVillagePieces.PieceWeight > list, java.util.Random random, int i)`
- `public static StructureVillagePieces.Village getVillageComponent( StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List< StructureComponent > pieces, java.util.Random random, int p1, int p2, int p3, EnumFacing facing, int p5)`
- `public static void setRandomProfession( EntityVillager entity, java.util.Random rand)`
- `public static void setRandomProfession( EntityZombieVillager entity, java.util.Random rand)`
- `public static void onSetProfession( EntityVillager entity, int network)`
- `public static void onSetProfession( EntityZombieVillager entity, int network)`
- `@Deprecated public static VillagerRegistry.VillagerProfession getById(int network)`
- `@Deprecated public static int getId( VillagerRegistry.VillagerProfession prof)`

## Description

Registry for villager trading control