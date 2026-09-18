# ICommandManager

## Class signature

```java
public interface ICommandManager
```

## Methods

- `int executeCommand( ICommandSender sender, java.lang.String rawCommand)`
- `java.util.List<java.lang.String> getTabCompletions( ICommandSender sender, java.lang.String input, @Nullable BlockPos pos)`
- `java.util.List< ICommand > getPossibleCommands( ICommandSender sender)`
- `java.util.Map<java.lang.String, ICommand > getCommands()`