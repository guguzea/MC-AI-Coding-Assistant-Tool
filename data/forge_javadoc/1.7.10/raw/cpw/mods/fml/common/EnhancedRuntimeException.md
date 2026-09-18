---
title: "EnhancedRuntimeException"
description: "RuntimeException that gives subclasses the simple opportunity to write extra data when printing the stack trace. Mainly a helper class as printsStackTrace has multiple signatures."
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/EnhancedRuntimeException.html"
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
