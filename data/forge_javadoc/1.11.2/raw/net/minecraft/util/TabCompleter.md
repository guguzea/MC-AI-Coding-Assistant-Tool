---
title: "TabCompleter"
description: "public abstract class TabCompleter extends java.lang.Object"
package: "net/minecraft/util"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/util/TabCompleter.html"
sourceType: javadoc
---

# TabCompleter

## Class signature

```java
public abstract class TabCompleter extends java.lang.Object
```

## Constructors

- `public TabCompleter( GuiTextField textFieldIn, boolean hasTargetBlockIn)`

## Methods

- `public void complete()`
- `@Nullable public abstract BlockPos getTargetBlockPos()`
- `public void setCompletions(java.lang.String... newCompl)`
- `public void resetDidComplete()`
- `public void resetRequested()`
