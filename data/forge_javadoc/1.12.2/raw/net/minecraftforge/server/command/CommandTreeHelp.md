---
title: "CommandTreeHelp"
description: "Add help for parent and all its children. Must be added to parent after all other commands."
package: "net/minecraftforge/server/command"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/command/CommandTreeHelp.html"
sourceType: javadoc
---

# CommandTreeHelp

## Class signature

```java
public class CommandTreeHelp extends CommandTreeBase
```

## Constructors

- `public CommandTreeHelp( CommandTreeBase parent)`

## Methods

- `public int getRequiredPermissionLevel()`
- `public java.lang.String getName()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`

## Description

Add help for parent and all its children. Must be added to parent after all other commands.
