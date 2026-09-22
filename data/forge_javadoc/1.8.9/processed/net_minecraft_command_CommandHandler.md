# CommandHandler

**Inheritance:** java.lang.Object → net.minecraft.command.CommandHandler

## Class signature

```java
public class CommandHandler extends java.lang.Object implements ICommandManager
```

## Constructors

- `CommandHandler()`

## Methods

- `int executeCommand(ICommandSender sender, java.lang.String rawCommand)`
- `java.util.Map<java.lang.String, ICommand> getCommands()`
- `java.util.List<ICommand> getPossibleCommands(ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletionOptions(ICommandSender sender, java.lang.String input, BlockPos pos)`
- `ICommand registerCommand(ICommand command)` — adds the command and any aliases it has to the internal map of available commands
- `protected boolean tryExecute(ICommandSender sender, java.lang.String[] args, ICommand command, java.lang.String input)`