---
title: "QuadGatheringTransformer"
description: "public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/pipeline/QuadGatheringTransformer.html"
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
