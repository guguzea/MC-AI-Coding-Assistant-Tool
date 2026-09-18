# ServerCommandManager

## Class signature

```java
public class ServerCommandManager extends CommandHandler implements ICommandListener
```

## Constructors

- `public ServerCommandManager( MinecraftServer serverIn)`

## Methods

- `public void notifyListener( ICommandSender sender, ICommand command, int flags, java.lang.String translationKey, java.lang.Object... translationArgs)`
- `protected MinecraftServer getServer()`