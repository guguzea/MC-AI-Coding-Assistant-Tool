---
title: "JsonSerializableSet"
description: "public class JsonSerializableSet extends com.google.common.collect.ForwardingSet<java.lang.String> implements IJsonSerializable"
package: "net/minecraft/util"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/JsonSerializableSet.html"
sourceType: javadoc
---

# JsonSerializableSet

**Inheritance:** java.lang.Object → com.google.common.collect.ForwardingObject → com.google.common.collect.ForwardingCollection<E> → com.google.common.collect.ForwardingSet<java.lang.String> → net.minecraft.util.JsonSerializableSet

## Class signature

```java
public class JsonSerializableSet extends com.google.common.collect.ForwardingSet<java.lang.String> implements IJsonSerializable
```

## Constructors

- `JsonSerializableSet()`

## Methods

- `protected java.util.Set<java.lang.String> delegate()`
- `void fromJson(com.google.gson.JsonElement json)`
- `com.google.gson.JsonElement getSerializableElement()`
