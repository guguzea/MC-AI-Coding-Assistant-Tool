---
title: "RConOutputStream"
description: "Resets the byte array output."
package: "net/minecraft/network/rcon"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/rcon/RConOutputStream.html"
sourceType: javadoc
---

# RConOutputStream

## Class signature

```java
public class RConOutputStream extends java.lang.Object
```

## Constructors

- `public RConOutputStream(int size)`

## Methods

- `public void writeByteArray(byte[] data) throws java.io.IOException`
- `public void writeString(java.lang.String data) throws java.io.IOException`
- `public void writeInt(int data) throws java.io.IOException`
- `public void writeShort(short data) throws java.io.IOException`
- `public byte[] toByteArray()`
- `public void reset()`

## Description

Resets the byte array output.
