---
title: "MapGenStructureIO"
description: "public class MapGenStructureIO extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/MapGenStructureIO.html"
sourceType: javadoc
---

# MapGenStructureIO

## Class signature

```java
public class MapGenStructureIO extends java.lang.Object
```

## Constructors

- `public MapGenStructureIO()`

## Methods

- `public static void registerStructure(java.lang.Class<? extends StructureStart > startClass, java.lang.String structureName)`
- `public static void registerStructureComponent(java.lang.Class<? extends StructureComponent > componentClass, java.lang.String componentName)`
- `public static java.lang.String getStructureStartName( StructureStart start)`
- `public static java.lang.String getStructureComponentName( StructureComponent component)`
- `public static StructureStart getStructureStart( NBTTagCompound tagCompound, World worldIn)`
- `public static StructureComponent getStructureComponent( NBTTagCompound tagCompound, World worldIn)`
