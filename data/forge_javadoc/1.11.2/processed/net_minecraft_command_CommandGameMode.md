# CommandGameMode

## Class signature

```java
public class CommandGameMode extends CommandBase
```

## Constructors

- `public CommandGameMode()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected GameType getGameModeFromCommand( ICommandSender sender, java.lang.String gameModeString) throws CommandException , NumberInvalidException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`