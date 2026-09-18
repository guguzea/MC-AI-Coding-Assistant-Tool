---
title: "MissingModsException"
description: "Deprecated. use getMissingModInfos()"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/MissingModsException.html"
sourceType: javadoc
---

# MissingModsException

## Class signature

```java
public class MissingModsException extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `public MissingModsException(java.lang.String id, java.lang.String name)`

## Methods

- `@Deprecated public MissingModsException(java.util.Set< ArtifactVersion > missingMods, java.lang.String id, java.lang.String name)`
- `public java.lang.String getMessage()`
- `public void addMissingMod( ArtifactVersion acceptedVersion, ArtifactVersion currentVersion, boolean required)`
- `public java.lang.String getModName()`
- `public java.util.List< MissingModsException.MissingModInfo > getMissingModInfos()`
- `protected void printStackTrace( EnhancedRuntimeException.WrappedPrintStream stream)`
- `public GuiScreen createGui()`

## Description

Deprecated. use getMissingModInfos()
