# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `java.lang.String getName()`
- `default ITextComponent getDisplayName()`
- `default void sendMessage( ITextComponent component)`
- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `default BlockPos getPosition()`
- `default Vec3d getPositionVector()`
- `World getEntityWorld()`
- `default Entity getCommandSenderEntity()`
- `default boolean sendCommandFeedback()`
- `default void setCommandStat( CommandResultStats.Type type, int amount)`
- `MinecraftServer getServer()`