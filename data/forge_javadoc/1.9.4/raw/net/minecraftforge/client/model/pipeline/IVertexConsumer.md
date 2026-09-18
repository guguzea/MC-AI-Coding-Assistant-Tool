---
title: "IVertexConsumer"
description: "Assumes that the data length is not less than e.getElementCount(). Also assumes that element index passed will increment from 0 to format.getElementCount() - 1. Normal, Color and UV are assumed to be "
package: "net/minecraftforge/client/model/pipeline"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/pipeline/IVertexConsumer.html"
sourceType: javadoc
---

# IVertexConsumer

## Class signature

```java
public interface IVertexConsumer
```

## Methods

- `VertexFormat getVertexFormat()`
- `void setQuadTint(int tint)`
- `void setQuadOrientation( EnumFacing orientation)`
- `void setApplyDiffuseLighting(boolean diffuse)`
- `void put(int element, float... data)`

## Description

Assumes that the data length is not less than e.getElementCount(). Also assumes that element index passed will increment from 0 to format.getElementCount() - 1. Normal, Color and UV are assumed to be 
