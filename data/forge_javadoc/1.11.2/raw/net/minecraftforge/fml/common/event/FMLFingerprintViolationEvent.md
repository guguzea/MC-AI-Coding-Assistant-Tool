---
title: "FMLFingerprintViolationEvent"
description: "A special event used when the Mod.certificateFingerprint() doesn't match the certificate loaded from the JAR file. You could use this to log a warning that the code that is running might not be yours,"
package: "net/minecraftforge/fml/common/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/event/FMLFingerprintViolationEvent.html"
sourceType: javadoc
---

# FMLFingerprintViolationEvent

## Class signature

```java
public class FMLFingerprintViolationEvent extends FMLEvent
```

## Constructors

- `public FMLFingerprintViolationEvent(boolean isDirectory, java.io.File source, com.google.common.collect.ImmutableSet<java.lang.String> fingerprints, java.lang.String expectedFingerprint)`

## Methods

- `public boolean isDirectory()`
- `public java.util.Set<java.lang.String> getFingerprints()`
- `public java.io.File getSource()`
- `public java.lang.String getExpectedFingerprint()`

## Description

A special event used when the Mod.certificateFingerprint() doesn't match the certificate loaded from the JAR file. You could use this to log a warning that the code that is running might not be yours,
