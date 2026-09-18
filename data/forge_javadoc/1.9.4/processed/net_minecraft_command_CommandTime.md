# CommandTime

## Class signature

```java
public class CommandTime extends CommandBase
```

## Constructors

- `public CommandTime()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `protected void setAllWorldTimes( MinecraftServer server, int time)`
- `protected void incrementAllWorldTimes( MinecraftServer server, int amount)`