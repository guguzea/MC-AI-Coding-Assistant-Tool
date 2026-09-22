# ICommandManager

## Class signature

```java
public interface ICommandManager
```

## Methods

- `int executeCommand(ICommandSender sender, java.lang.String rawCommand)`
- `java.util.Map<java.lang.String, ICommand> getCommands()`
- `java.util.List<ICommand> getPossibleCommands(ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletions(ICommandSender sender, java.lang.String input, BlockPos pos)`