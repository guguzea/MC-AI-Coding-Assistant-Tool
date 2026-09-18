---
title: "EnhancedRuntimeException"
description: "RuntimeException that gives subclasses the simple opportunity to write extra data when printing the stack trace. Mainly a helper class as printsStackTrace has multiple signatures."
package: "net/minecraftforge/fml/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/EnhancedRuntimeException.html"
sourceType: javadoc
---

# EnhancedRuntimeException

## Class signature

```java
public abstract class EnhancedRuntimeException extends java.lang.RuntimeException
```

## Constructors

- `public EnhancedRuntimeException()`
- `public EnhancedRuntimeException(java.lang.String message)`
- `public EnhancedRuntimeException(java.lang.String message, java.lang.Throwable cause)`
- `public EnhancedRuntimeException(java.lang.Throwable cause)`

## Methods

- `public java.lang.String getMessage()`
- `public void printStackTrace(java.io.PrintWriter s)`
- `public void printStackTrace(java.io.PrintStream s)`
- `protected abstract void printStackTrace( EnhancedRuntimeException.WrappedPrintStream stream)`

## Description

RuntimeException that gives subclasses the simple opportunity to write extra data when printing the stack trace. Mainly a helper class as printsStackTrace has multiple signatures.
