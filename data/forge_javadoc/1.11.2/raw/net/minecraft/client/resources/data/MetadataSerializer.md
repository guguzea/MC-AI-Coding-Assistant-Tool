---
title: "MetadataSerializer"
description: "public class MetadataSerializer extends java.lang.Object"
package: "net/minecraft/client/resources/data"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/resources/data/MetadataSerializer.html"
sourceType: javadoc
---

# MetadataSerializer

## Class signature

```java
public class MetadataSerializer extends java.lang.Object
```

## Constructors

- `public MetadataSerializer()`

## Methods

- `public <T extends IMetadataSection > void registerMetadataSectionType( IMetadataSectionSerializer <T> metadataSectionSerializer, java.lang.Class<T> clazz)`
- `public <T extends IMetadataSection > T parseMetadataSection(java.lang.String sectionName, com.google.gson.JsonObject json)`
