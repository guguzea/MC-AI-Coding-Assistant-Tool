# CommandDefaultGameMode

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandGameMode → net.minecraft.command.CommandDefaultGameMode

## Class signature

```java
public class CommandDefaultGameMode extends CommandGameMode
```

## Constructors

- `CommandDefaultGameMode()`

## Methods

- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
- `protected void setGameType(WorldSettings.GameType p_71541_1_)`