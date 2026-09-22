---
title: "RConUtils"
description: "public class RConUtils extends java.lang.Object"
package: "net/minecraft/network/rcon"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/rcon/RConUtils.html"
sourceType: javadoc
---

# RConUtils

**Inheritance:** java.lang.Object → net.minecraft.network.rcon.RConUtils

## Class signature

```java
public class RConUtils extends java.lang.Object
```

## Constructors

- `RConUtils()`

## Methods

- `static java.lang.String getByteAsHexString(byte input)` — Returns a String representation of the byte in hexadecimal format
- `static int getBytesAsBEint(byte[] p_72664_0_, int p_72664_1_, int p_72664_2_)` — Read 4 bytes from the given array in big-endian format and return them as an int
- `static int getBytesAsLEInt(byte[] p_72665_0_, int p_72665_1_, int p_72665_2_)` — Read 4 bytes from the given array in little-endian format and return them as an int
- `static java.lang.String getBytesAsString(byte[] p_72661_0_, int p_72661_1_, int p_72661_2_)` — Read a null-terminated string from the given byte array
- `static int getRemainingBytesAsLEInt(byte[] p_72662_0_, int p_72662_1_)` — Read 4 bytes from the

## Fields

- `static char[] hexDigits` — Translation array of decimal to hex digits
