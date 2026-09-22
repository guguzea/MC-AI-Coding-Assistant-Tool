---
title: "ICommandManager"
description: "public interface ICommandManager"
package: "net/minecraft/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/ICommandManager.html"
sourceType: javadoc
---

# ICommandManager

## Class signature

```java
public interface ICommandManager
```

## Methods

- `int executeCommand(ICommandSender sender, java.lang.String rawCommand)`
- `java.util.Map<java.lang.String, ICommand> getCommands()`
- `java.util.List<ICommand> getPossibleCommands(ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletionOptions(ICommandSender sender, java.lang.String input, BlockPos pos)`
