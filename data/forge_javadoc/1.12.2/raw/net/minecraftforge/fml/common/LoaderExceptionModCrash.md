---
title: "LoaderExceptionModCrash"
description: "Prevent LoaderException from adding its own stack trace to the wrapped throwable's stack trace."
package: "net/minecraftforge/fml/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/LoaderExceptionModCrash.html"
sourceType: javadoc
---

# LoaderExceptionModCrash

## Class signature

```java
public class LoaderExceptionModCrash extends LoaderException
```

## Constructors

- `public LoaderExceptionModCrash(java.lang.String message, java.lang.Throwable cause)`

## Methods

- `public java.lang.Throwable fillInStackTrace()`

## Description

Prevent LoaderException from adding its own stack trace to the wrapped throwable's stack trace.
