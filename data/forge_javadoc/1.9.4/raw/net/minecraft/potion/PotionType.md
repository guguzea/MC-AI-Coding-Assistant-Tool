---
title: "PotionType"
description: "public class PotionType extends IForgeRegistryEntry.Impl<PotionType>"
package: "net/minecraft/potion"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/potion/PotionType.html"
sourceType: javadoc
---

# PotionType

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<PotionType> → net.minecraft.potion.PotionType

## Class signature

```java
public class PotionType extends IForgeRegistryEntry.Impl<PotionType>
```

## Constructors

- `PotionType(PotionEffect ... p_i46739_1_)`
- `PotionType(java.lang.String p_i46740_1_, PotionEffect ... p_i46740_2_)`

## Methods

- `java.util.List<PotionEffect> getEffects()`
- `static int getID(PotionType p_185171_0_)`
- `java.lang.String getNamePrefixed(java.lang.String p_185174_1_)`
- `static PotionType getPotionTypeForID(int p_185169_0_)`
- `static PotionType getPotionTypeForName(java.lang.String p_185168_0_)`
- `boolean hasInstantEffect()`
- `protected static void registerPotionType(java.lang.String p_185173_0_, PotionType p_185173_1_)`
- `static void registerPotionTypes()`

## Fields

- `static RegistryNamespacedDefaultedByKey<ResourceLocation, PotionType> REGISTRY`
