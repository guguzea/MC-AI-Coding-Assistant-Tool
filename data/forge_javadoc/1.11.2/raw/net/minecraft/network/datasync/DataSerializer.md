---
title: "DataSerializer"
description: "public interface DataSerializer<T>"
package: "net/minecraft/network/datasync"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/datasync/DataSerializer.html"
sourceType: javadoc
---

# DataSerializer

## Class signature

```java
public interface DataSerializer<T>
```

## Methods

- `void write( PacketBuffer buf, T value)`
- `T read( PacketBuffer buf) throws java.io.IOException`
- `DataParameter < T > createKey(int id)`
