---
title: "ICommandManager"
description: "public interface ICommandManager"
package: "net/minecraft/command"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/ICommandManager.html"
sourceType: javadoc
---

# ICommandManager

## Class signature

```java
public interface ICommandManager
```

## Methods

- `int executeCommand( ICommandSender sender, java.lang.String rawCommand)`
- `java.util.List<java.lang.String> getTabCompletions( ICommandSender sender, java.lang.String input, @Nullable BlockPos pos)`
- `java.util.List< ICommand > getPossibleCommands( ICommandSender sender)`
- `java.util.Map<java.lang.String, ICommand > getCommands()`
