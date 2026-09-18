---
title: "CommandTreeBase"
description: "Base class for commands that has subcommands. E.g. /team settings set [value] settings is subcommand of team and set is subcommand of settings"
package: "net/minecraftforge/server/command"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/command/CommandTreeBase.html"
sourceType: javadoc
---

# CommandTreeBase

## Class signature

```java
public abstract class CommandTreeBase extends CommandBase
```

## Constructors

- `public CommandTreeBase()`

## Methods

- `public void addSubcommand( ICommand c)`
- `public java.util.Collection< ICommand > getSubCommands()`
- `public java.util.Map<java.lang.String, ICommand > getCommandMap()`
- `public java.util.List< ICommand > getSortedCommandList()`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`

## Description

Base class for commands that has subcommands. E.g. /team settings set [value] settings is subcommand of team and set is subcommand of settings
