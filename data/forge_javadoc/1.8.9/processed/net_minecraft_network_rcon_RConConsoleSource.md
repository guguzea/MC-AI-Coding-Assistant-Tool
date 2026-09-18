# RConConsoleSource

## Class signature

```java
public class RConConsoleSource extends java.lang.Object implements ICommandSender
```

## Constructors

- `public RConConsoleSource()`

## Methods

- `public java.lang.String getName()`
- `public IChatComponent getDisplayName()`
- `public void addChatMessage( IChatComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public BlockPos getPosition()`
- `public Vec3 getPositionVector()`
- `public World getEntityWorld()`
- `public Entity getCommandSenderEntity()`
- `public boolean sendCommandFeedback()`
- `public void setCommandStat( CommandResultStats.Type type, int amount)`
- `public static RConConsoleSource getInstance()`
- `public void resetLog()`
- `public java.lang.String getLogContents()`

## Description

Send a chat message to the CommandSender