---
title: "TabCompleter"
description: "public abstract class TabCompleter extends java.lang.Object"
package: "net/minecraft/util"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/TabCompleter.html"
sourceType: javadoc
---

# TabCompleter

**Inheritance:** java.lang.Object → net.minecraft.util.TabCompleter

## Class signature

```java
public abstract class TabCompleter extends java.lang.Object
```

## Constructors

- `TabCompleter(GuiTextField textFieldIn, boolean hasTargetBlockIn)`

## Methods

- `void complete()`
- `abstract BlockPos getTargetBlockPos()`
- `void resetDidComplete()`
- `void resetRequested()`
- `void setCompletions(java.lang.String[] newCompl)`

## Fields

- `protected int completionIdx`
- `protected java.util.List<java.lang.String> completions`
- `protected boolean didComplete`
- `protected boolean hasTargetBlock`
- `protected boolean requestedCompletions`
- `protected GuiTextField textField`
