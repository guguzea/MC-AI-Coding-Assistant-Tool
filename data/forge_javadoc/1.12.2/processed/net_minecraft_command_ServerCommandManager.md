# ServerCommandManager

**Inheritance:** java.lang.Object → net.minecraft.command.CommandHandler → net.minecraft.command.ServerCommandManager

## Class signature

```java
public class ServerCommandManager extends CommandHandler implements ICommandListener
```

## Constructors

- `ServerCommandManager(MinecraftServer serverIn)`

## Methods

- `protected MinecraftServer getServer()`
- `void notifyListener(ICommandSender sender, ICommand command, int flags, java.lang.String translationKey, java.lang.Object... translationArgs)`