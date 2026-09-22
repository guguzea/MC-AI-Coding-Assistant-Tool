---
title: "CommandHelp"
description: "public class CommandHelp extends CommandBase"
package: "net/minecraft/command"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/CommandHelp.html"
sourceType: javadoc
---

# CommandHelp

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandHelp

## Class signature

```java
public class CommandHelp extends CommandBase
```

## Constructors

- `CommandHelp()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `protected java.util.Map<java.lang.String, ICommand> getCommandMap(MinecraftServer server)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `protected java.util.List<ICommand> getSortedPossibleCommands(ICommandSender sender, MinecraftServer server)`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
