# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `Entity getCommandSenderEntity()`
- `ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getName()`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `boolean sendCommandFeedback()`
- `void sendMessage(ITextComponent component)`
- `void setCommandStat(CommandResultStats.Type type, int amount)`