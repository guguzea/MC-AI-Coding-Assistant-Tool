---
title: "RConOutputStream"
description: "public class RConOutputStream extends java.lang.Object"
package: "net/minecraft/network/rcon"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/rcon/RConOutputStream.html"
sourceType: javadoc
---

# RConOutputStream

**Inheritance:** java.lang.Object → net.minecraft.network.rcon.RConOutputStream

## Class signature

```java
public class RConOutputStream extends java.lang.Object
```

## Constructors

- `RConOutputStream(int size)`

## Methods

- `void reset()` — Resets the byte array output.
- `byte[] toByteArray()` — Returns the contents of the output stream as a byte array
- `void writeByteArray(byte[] data)` — Writes the given byte array to the output stream
- `void writeInt(int data)` — Writes the given int to the output stream
- `void writeShort(short data)` — Writes the given short to the output stream
- `void writeString(java.lang.String data)` — Writes the given String to the output stream
