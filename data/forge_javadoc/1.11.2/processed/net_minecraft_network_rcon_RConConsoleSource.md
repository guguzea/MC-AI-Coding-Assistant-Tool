# RConConsoleSource

## Class signature

```java
public class RConConsoleSource extends java.lang.Object implements ICommandSender
```

## Constructors

- `public RConConsoleSource( MinecraftServer serverIn)`

## Methods

- `public java.lang.String getName()`
- `public ITextComponent getDisplayName()`
- `public void sendMessage( ITextComponent component)`
- `public boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `public BlockPos getPosition()`
- `public Vec3d getPositionVector()`
- `public World getEntityWorld()`
- `public Entity getCommandSenderEntity()`
- `public boolean sendCommandFeedback()`
- `public void setCommandStat( CommandResultStats.Type type, int amount)`
- `public MinecraftServer getServer()`
- `public void resetLog()`
- `public java.lang.String getLogContents()`