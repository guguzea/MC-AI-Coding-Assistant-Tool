# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `default Entity getCommandSenderEntity()`
- `default ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getName()`
- `default BlockPos getPosition()`
- `default Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `default boolean sendCommandFeedback()`
- `default void sendMessage(ITextComponent component)`
- `default void setCommandStat(CommandResultStats.Type type, int amount)`