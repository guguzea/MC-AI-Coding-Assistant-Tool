# ServerCommandManager

**Inheritance:** java.lang.Object → net.minecraft.command.CommandHandler → net.minecraft.command.ServerCommandManager

## Class signature

```java
public class ServerCommandManager extends CommandHandler implements IAdminCommand
```

## Constructors

- `ServerCommandManager()`

## Methods

- `void notifyOperators(ICommandSender sender, ICommand command, int flags, java.lang.String msgFormat, java.lang.Object... msgParams)` — Send an informative message to the server operators