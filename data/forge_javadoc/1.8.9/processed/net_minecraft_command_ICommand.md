# ICommand

## Class signature

```java
public interface ICommand extends java.lang.Comparable<ICommand>
```

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean canCommandSenderUseCommand(ICommandSender sender)` — Returns true if the given command sender is allowed to use this command.
- `java.util.List<java.lang.String> getCommandAliases()`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `boolean isUsernameIndex(java.lang.String[] args, int index)` — Return whether the specified command parameter index is a username parameter.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked