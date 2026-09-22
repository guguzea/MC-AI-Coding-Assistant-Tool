---
title: "CommandTreeBase"
description: "public abstract class CommandTreeBase extends CommandBase"
package: "net/minecraftforge/server/command"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/command/CommandTreeBase.html"
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

- `void addSubcommand(ICommand c)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.util.Map<java.lang.String, ICommand> getCommandMap()`
- `java.util.List<ICommand> getSortedCommandList()`
- `java.util.Collection<ICommand> getSubCommands()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
