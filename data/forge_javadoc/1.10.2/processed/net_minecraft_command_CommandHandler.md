# CommandHandler

## Class signature

```java
public abstract class CommandHandler extends java.lang.Object implements ICommandManager
```

## Constructors

- `public CommandHandler()`

## Methods

- `public int executeCommand( ICommandSender sender, java.lang.String rawCommand)`
- `protected boolean tryExecute( ICommandSender sender, java.lang.String[] args, ICommand command, java.lang.String input)`
- `protected abstract MinecraftServer getServer()`
- `public ICommand registerCommand( ICommand command)`
- `public java.util.List<java.lang.String> getTabCompletionOptions( ICommandSender sender, java.lang.String input, @Nullable BlockPos pos)`
- `public java.util.List< ICommand > getPossibleCommands( ICommandSender sender)`
- `public java.util.Map<java.lang.String, ICommand > getCommands()`