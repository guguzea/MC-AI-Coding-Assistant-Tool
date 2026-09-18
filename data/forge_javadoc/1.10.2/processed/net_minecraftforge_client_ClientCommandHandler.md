# ClientCommandHandler

## Class signature

```java
public class ClientCommandHandler extends CommandHandler
```

## Constructors

- `public ClientCommandHandler()`

## Methods

- `public int executeCommand( ICommandSender sender, java.lang.String message)`
- `public void autoComplete(java.lang.String leftOfCursor)`
- `protected MinecraftServer getServer()`

## Description

The class that handles client-side chat commands. You should register any commands that you want handled on the client with this command handler. If there is a command with the same name registered bo