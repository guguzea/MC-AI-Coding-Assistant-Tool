---
title: "VillagerRegistry"
description: "Registry for villager trading control"
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/VillagerRegistry.html"
sourceType: javadoc
---

# VillagerRegistry

## Class signature

```java
public class VillagerRegistry extends java.lang.Object
```

## Constructors

- `public VillagerRegistry()`

## Methods

- `public static VillagerRegistry instance()`
- `public void registerVillagerId(int id)`
- `public void registerVillagerSkin(int villagerId, ResourceLocation villagerSkin)`
- `public void registerVillageCreationHandler( VillagerRegistry.IVillageCreationHandler handler)`
- `public void registerVillageTradeHandler(int villagerId, VillagerRegistry.IVillageTradeHandler handler)`
- `public static ResourceLocation getVillagerSkin(int villagerType, ResourceLocation defaultSkin)`
- `public static java.util.Collection<java.lang.Integer> getRegisteredVillagers()`
- `public static void manageVillagerTrades( MerchantRecipeList recipeList, EntityVillager villager, int villagerType, java.util.Random random)`
- `public static void addExtraVillageComponents(java.util.ArrayList components, java.util.Random random, int i)`
- `public static java.lang.Object getVillageComponent( StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List pieces, java.util.Random random, int p1, int p2, int p3, int p4, int p5)`
- `public static void addEmeraldBuyRecipe( EntityVillager villager, MerchantRecipeList list, java.util.Random random, Item item, float chance, int min, int max)`
- `public static void addEmeraldSellRecipe( EntityVillager villager, MerchantRecipeList list, java.util.Random random, Item item, float chance, int min, int max)`
- `public static void applyRandomTrade( EntityVillager villager, java.util.Random rand)`

## Description

Registry for villager trading control
