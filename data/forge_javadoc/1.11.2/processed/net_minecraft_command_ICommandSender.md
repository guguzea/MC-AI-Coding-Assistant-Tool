# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `java.lang.String getName()`
- `ITextComponent getDisplayName()`
- `void sendMessage( ITextComponent component)`
- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `World getEntityWorld()`
- `@Nullable Entity getCommandSenderEntity()`
- `boolean sendCommandFeedback()`
- `void setCommandStat( CommandResultStats.Type type, int amount)`
- `@Nullable MinecraftServer getServer()`