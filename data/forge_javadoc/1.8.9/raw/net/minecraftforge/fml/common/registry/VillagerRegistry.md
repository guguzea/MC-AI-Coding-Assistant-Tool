---
title: "VillagerRegistry"
description: "Registry for villager trading control"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/VillagerRegistry.html"
sourceType: javadoc
---

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
