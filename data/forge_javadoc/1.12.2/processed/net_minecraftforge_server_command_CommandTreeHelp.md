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