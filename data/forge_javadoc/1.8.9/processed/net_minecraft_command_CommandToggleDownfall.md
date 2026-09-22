# CommandToggleDownfall

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandToggleDownfall

## Class signature

```java
public class CommandToggleDownfall extends CommandBase
```

## Constructors

- `CommandToggleDownfall()`

## Methods

- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
- `protected void toggleDownfall()` — Toggle rain and enable thundering.