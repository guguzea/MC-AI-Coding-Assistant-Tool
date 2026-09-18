---
title: "IFMLCallHook"
description: "This call hook allows for code to execute at the very early stages of minecraft initialization. FML uses it to validate that there is a safe environment for further loading of FML."
package: "net/minecraftforge/fml/relauncher"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/relauncher/IFMLCallHook.html"
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
