---
title: "DataSerializer"
description: "public interface DataSerializer<T>"
package: "net/minecraft/network/datasync"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/datasync/DataSerializer.html"
sourceType: javadoc
---

# DataSerializer

## Class signature

```java
public interface DataSerializer<T>
```

## Methods

- `T copyValue(T value)`
- `DataParameter<T> createKey(int id)`
- `T read(PacketBuffer buf)`
- `void write(PacketBuffer buf, T value)`
