---
title: "MissingModsException"
description: "public class MissingModsException extends EnhancedRuntimeException"
package: "net/minecraftforge/fml/common"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/MissingModsException.html"
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
