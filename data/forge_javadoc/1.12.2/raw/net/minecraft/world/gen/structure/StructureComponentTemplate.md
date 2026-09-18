---
title: "StructureComponentTemplate"
description: "public abstract class StructureComponentTemplate extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/structure/StructureComponentTemplate.html"
sourceType: javadoc
---

# StructureComponentTemplate

## Class signature

```java
public abstract class StructureComponentTemplate extends StructureComponent
```

## Constructors

- `public StructureComponentTemplate()`
- `public StructureComponentTemplate(int type)`

## Methods

- `protected void setup( Template templateIn, BlockPos pos, PlacementSettings settings)`
- `protected void writeStructureToNBT( NBTTagCompound tagCompound)`
- `protected void readStructureFromNBT( NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `public boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `protected abstract void handleDataMarker(java.lang.String function, BlockPos pos, World worldIn, java.util.Random rand, StructureBoundingBox sbb)`
- `public void offset(int x, int y, int z)`
