---
title: "IFMLCallHook"
description: "This call hook allows for code to execute at the very early stages of minecraft initialization. FML uses it to validate that there is a safe environment for further loading of FML."
package: "cpw/mods/fml/relauncher"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/relauncher/IFMLCallHook.html"
sourceType: javadoc
---

# IFMLCallHook

## Class signature

```java
public interface IFMLCallHook extends java.util.concurrent.Callable<java.lang.Void>
```

## Methods

- `void injectData(java.util.Map<java.lang.String,java.lang.Object> data)`

## Description

This call hook allows for code to execute at the very early stages of minecraft initialization. FML uses it to validate that there is a safe environment for further loading of FML.
