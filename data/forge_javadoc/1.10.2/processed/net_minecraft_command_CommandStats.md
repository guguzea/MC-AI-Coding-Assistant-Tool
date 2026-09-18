# CommandStats

## Class signature

```java
public class CommandStats extends CommandBase
```

## Constructors

- `public CommandStats()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `protected java.util.List<java.lang.String> getObjectiveNames( MinecraftServer server)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`