---
title: "RegistryBuilder"
description: "public class RegistryBuilder<T extends IForgeRegistryEntry <T>> extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/registry/RegistryBuilder.html"
sourceType: javadoc
---

# RegistryBuilder

## Class signature

```java
public class RegistryBuilder<T extends IForgeRegistryEntry <T>> extends java.lang.Object
```

## Constructors

- `public RegistryBuilder()`

## Methods

- `public RegistryBuilder < T > setName( ResourceLocation name)`
- `public RegistryBuilder < T > setType(java.lang.Class< T > type)`
- `public RegistryBuilder < T > setIDRange(int min, int max)`
- `public RegistryBuilder < T > addCallback(java.lang.Object inst)`
- `public RegistryBuilder < T > add( IForgeRegistry.AddCallback < T > add)`
- `public RegistryBuilder < T > add( IForgeRegistry.ClearCallback < T > clear)`
- `public RegistryBuilder < T > add( IForgeRegistry.CreateCallback < T > create)`
- `public RegistryBuilder < T > add( IForgeRegistry.SubstitutionCallback < T > sub)`
- `public IForgeRegistry < T > create()`
