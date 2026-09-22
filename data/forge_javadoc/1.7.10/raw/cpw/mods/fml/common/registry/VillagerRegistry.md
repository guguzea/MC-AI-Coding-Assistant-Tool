---
title: "VillagerRegistry"
description: "public class VillagerRegistry extends java.lang.Object"
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/VillagerRegistry.html"
sourceType: javadoc
---

# VillagerRegistry

**Inheritance:** java.lang.Object → cpw.mods.fml.common.registry.VillagerRegistry

## Class signature

```java
public class VillagerRegistry extends java.lang.Object
```

## Constructors

- `VillagerRegistry()`

## Methods

- `static void addEmeraldBuyRecipe(EntityVillager villager, MerchantRecipeList list, java.util.Random random, Item item, float chance, int min, int max)`
- `static void addEmeraldSellRecipe(EntityVillager villager, MerchantRecipeList list, java.util.Random random, Item item, float chance, int min, int max)`
- `static void addExtraVillageComponents(java.util.ArrayList components, java.util.Random random, int i)`
- `static void applyRandomTrade(EntityVillager villager, java.util.Random rand)`
- `static java.util.Collection<java.lang.Integer> getRegisteredVillagers()` — Returns a list of all added villager types
- `static java.lang.Object getVillageComponent(StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List pieces, java.util.Random random, int p1, int p2, int p3, int p4, int p5)`
- `static ResourceLocation getVillagerSkin(int villagerType, ResourceLocation defaultSkin)` — Callback to setup new villager types
- `static VillagerRegistry instance()`
- `static void manageVillagerTrades(MerchantRecipeList recipeList, EntityVillager villager, int villagerType, java.util.Random random)` — Callback to handle trade setup for villagers
- `void registerVillageCreationHandler(VillagerRegistry.IVillageCreationHandler handler)` — Register a new village creation handler
- `void registerVillagerId(int id)` — Register your villager id
- `void registerVillagerSkin(int villagerId, ResourceLocation villagerSkin)` — Register a new skin for a villager type
- `void registerVillageTradeHandler(int villagerId, VillagerRegistry.IVillageTradeHandler handler)` — Register a new villager trading handler for the specified villager type
