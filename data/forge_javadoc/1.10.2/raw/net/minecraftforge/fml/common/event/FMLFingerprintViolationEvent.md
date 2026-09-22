---
title: "FMLFingerprintViolationEvent"
description: "public class FMLFingerprintViolationEvent extends FMLEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLFingerprintViolationEvent.html"
sourceType: javadoc
---

# FMLFingerprintViolationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLFingerprintViolationEvent

## Class signature

```java
public class FMLFingerprintViolationEvent extends FMLEvent
```

## Constructors

- `FMLFingerprintViolationEvent(boolean isDirectory, java.io.File source, com.google.common.collect.ImmutableSet<java.lang.String> fingerprints, java.lang.String expectedFingerprint)`

## Methods

- `java.lang.String getExpectedFingerprint()`
- `java.util.Set<java.lang.String> getFingerprints()`
- `java.io.File getSource()`
- `boolean isDirectory()`
