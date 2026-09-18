---
title: "QuadGatheringTransformer"
description: "public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/pipeline/QuadGatheringTransformer.html"
sourceType: javadoc
---

# QuadGatheringTransformer

## Class signature

```java
public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `public QuadGatheringTransformer()`

## Methods

- `public void setParent( IVertexConsumer parent)`
- `public void setVertexFormat( VertexFormat format)`
- `public VertexFormat getVertexFormat()`
- `public void put(int element, float... data)`
- `protected abstract void processQuad()`
