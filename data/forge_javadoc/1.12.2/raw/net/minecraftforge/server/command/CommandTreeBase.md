---
title: "CommandTreeBase"
description: "public abstract class CommandTreeBase extends CommandBase"
package: "net/minecraftforge/server/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/command/CommandTreeBase.html"
sourceType: javadoc
---

# CommandTreeBase

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraftforge.server.command.CommandTreeBase

## Class signature

```java
public abstract class CommandTreeBase extends CommandBase
```

## Constructors

- `CommandTreeBase()`

## Methods

- `void addSubcommand(ICommand command)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.util.Map<java.lang.String, ICommand> getCommandMap()`
- `java.util.List<ICommand> getSortedCommandList()`
- `ICommand getSubCommand(java.lang.String command)`
- `java.util.Collection<ICommand> getSubCommands()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
