---
title: "TabCompleter"
description: "public abstract class TabCompleter extends java.lang.Object"
package: "net/minecraft/util"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/TabCompleter.html"
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
