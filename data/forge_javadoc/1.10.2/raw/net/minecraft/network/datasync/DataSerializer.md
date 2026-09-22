---
title: "DataSerializer"
description: "public interface DataSerializer<T>"
package: "net/minecraft/network/datasync"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/datasync/DataSerializer.html"
sourceType: javadoc
---

# DataSerializer

## Class signature

```java
public interface DataSerializer<T>
```

## Methods

- `DataParameter<T> createKey(int id)`
- `T read(PacketBuffer buf)`
- `void write(PacketBuffer buf, T value)`
