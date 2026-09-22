---
title: "TransformerConsumer"
description: "public abstract class TransformerConsumer extends java.lang.Object implements IVertexConsumer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/pipeline/TransformerConsumer.html"
sourceType: javadoc
---

# TransformerConsumer

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.TransformerConsumer

## Class signature

```java
public abstract class TransformerConsumer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `TransformerConsumer(IVertexConsumer parent)`

## Methods

- `VertexFormat getVertexFormat()`
- `void put(int element, float... data)`
- `protected abstract float[] transform(int element, float... data)`
