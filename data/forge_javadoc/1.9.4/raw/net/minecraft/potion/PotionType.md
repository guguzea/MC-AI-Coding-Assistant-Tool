---
title: "PotionType"
description: "public class PotionType extends IForgeRegistryEntry.Impl < PotionType >"
package: "net/minecraft/potion"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/potion/PotionType.html"
sourceType: javadoc
---

# PotionType

## Class signature

```java
public class PotionType extends IForgeRegistryEntry.Impl < PotionType >
```

## Constructors

- `public PotionType( PotionEffect ... p_i46739_1_)`
- `public PotionType(@Nullable java.lang.String p_i46740_1_, PotionEffect ... p_i46740_2_)`

## Methods

- `@Nullable public static PotionType getPotionTypeForID(int p_185169_0_)`
- `public static int getID( PotionType p_185171_0_)`
- `@Nullable public static PotionType getPotionTypeForName(java.lang.String p_185168_0_)`
- `public java.lang.String getNamePrefixed(java.lang.String p_185174_1_)`
- `public java.util.List< PotionEffect > getEffects()`
- `public static void registerPotionTypes()`
- `protected static void registerPotionType(java.lang.String p_185173_0_, PotionType p_185173_1_)`
- `public boolean hasInstantEffect()`
