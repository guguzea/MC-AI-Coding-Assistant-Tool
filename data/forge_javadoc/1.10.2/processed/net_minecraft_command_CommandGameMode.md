# CommandGameMode

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandGameMode

## Class signature

```java
public class CommandGameMode extends CommandBase
```

## Constructors

- `CommandGameMode()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `protected GameType getGameModeFromCommand(ICommandSender sender, java.lang.String gameModeString)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`