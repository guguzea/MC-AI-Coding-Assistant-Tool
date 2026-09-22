---
title: "MultipleModsErrored"
description: "public class MultipleModsErrored extends EnhancedRuntimeException implements IDisplayableError"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/MultipleModsErrored.html"
sourceType: javadoc
---

# MultipleModsErrored

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.MultipleModsErrored

## Class signature

```java
public class MultipleModsErrored extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `MultipleModsErrored(java.util.List<WrongMinecraftVersionException> wrongMinecraftExceptions, java.util.List<MissingModsException> missingModsExceptions)`

## Methods

- `GuiScreen createGui()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`

## Fields

- `java.util.List<MissingModsException> missingModsExceptions`
- `java.util.List<WrongMinecraftVersionException> wrongMinecraftExceptions`
