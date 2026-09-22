---
title: "CommandHandler"
description: "public abstract class CommandHandler extends java.lang.Object implements ICommandManager"
package: "net/minecraft/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/CommandHandler.html"
sourceType: javadoc
---

# CommandHandler

**Inheritance:** java.lang.Object → net.minecraft.command.CommandHandler

## Class signature

```java
public abstract class CommandHandler extends java.lang.Object implements ICommandManager
```

## Constructors

- `CommandHandler()`

## Methods

- `int executeCommand(ICommandSender sender, java.lang.String rawCommand)`
- `java.util.Map<java.lang.String, ICommand> getCommands()`
- `java.util.List<ICommand> getPossibleCommands(ICommandSender sender)`
- `protected abstract MinecraftServer getServer()`
- `java.util.List<java.lang.String> getTabCompletions(ICommandSender sender, java.lang.String input, BlockPos pos)`
- `ICommand registerCommand(ICommand command)`
- `protected boolean tryExecute(ICommandSender sender, java.lang.String[] args, ICommand command, java.lang.String input)`
