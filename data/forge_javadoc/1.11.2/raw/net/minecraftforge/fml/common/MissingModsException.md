---
title: "MissingModsException"
description: "public class MissingModsException extends EnhancedRuntimeException"
package: "net/minecraftforge/fml/common"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/MissingModsException.html"
sourceType: javadoc
---

# MissingModsException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.MissingModsException

## Class signature

```java
public class MissingModsException extends EnhancedRuntimeException
```

## Constructors

- `MissingModsException(java.util.Set<ArtifactVersion> missingMods, java.lang.String id, java.lang.String name)`

## Methods

- `java.lang.String getModName()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`

## Fields

- `java.util.Set<ArtifactVersion> missingMods`
