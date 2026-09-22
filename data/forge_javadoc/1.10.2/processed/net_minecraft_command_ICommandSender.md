# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `void addChatMessage(ITextComponent component)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `Entity getCommandSenderEntity()`
- `ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getName()`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `boolean sendCommandFeedback()`
- `void setCommandStat(CommandResultStats.Type type, int amount)`