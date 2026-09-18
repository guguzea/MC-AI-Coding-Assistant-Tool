---
title: "TransformerConsumer"
description: "public abstract class TransformerConsumer extends java.lang.Object implements IVertexConsumer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/pipeline/TransformerConsumer.html"
sourceType: javadoc
---

# TransformerConsumer

## Class signature

```java
public abstract class TransformerConsumer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `protected TransformerConsumer( IVertexConsumer parent)`

## Methods

- `public VertexFormat getVertexFormat()`
- `public void put(int element, float... data)`
- `protected abstract float[] transform(int element, float... data)`
