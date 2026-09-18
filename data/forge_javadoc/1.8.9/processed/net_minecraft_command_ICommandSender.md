# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `java.lang.String getName()`
- `IChatComponent getDisplayName()`
- `void addChatMessage( IChatComponent component)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `BlockPos getPosition()`
- `Vec3 getPositionVector()`
- `World getEntityWorld()`
- `Entity getCommandSenderEntity()`
- `boolean sendCommandFeedback()`
- `void setCommandStat( CommandResultStats.Type type, int amount)`

## Description

Send a chat message to the CommandSender