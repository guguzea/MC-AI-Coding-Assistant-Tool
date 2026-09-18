# VillagerRegistry

## Class signature

```java
public class VillagerRegistry extends java.lang.Object
```

## Methods

- `public static VillagerRegistry instance()`
- `@Deprecated public void registerVillagerId(int id)`
- `@Deprecated public void registerVillagerSkin(int villagerId, ResourceLocation villagerSkin)`
- `public void registerVillageCreationHandler( VillagerRegistry.IVillageCreationHandler handler)`
- `@Deprecated public static ResourceLocation getVillagerSkin(int villagerType, ResourceLocation defaultSkin)`
- `@Deprecated public static java.util.Collection<java.lang.Integer> getRegisteredVillagers()`
- `public static void addExtraVillageComponents(java.util.List< StructureVillagePieces.PieceWeight > list, java.util.Random random, int i)`
- `public static StructureVillagePieces.Village getVillageComponent( StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List< StructureComponent > pieces, java.util.Random random, int p1, int p2, int p3, EnumFacing facing, int p5)`
- `public void register( VillagerRegistry.VillagerProfession prof)`
- `public static void setRandomProfession( EntityVillager entity, java.util.Random rand)`

## Description

Registry for villager trading control