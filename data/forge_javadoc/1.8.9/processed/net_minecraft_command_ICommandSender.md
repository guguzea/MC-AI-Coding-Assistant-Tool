# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `void addChatMessage(IChatComponent component)` — Send a chat message to the CommandSender
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `Entity getCommandSenderEntity()` — Returns the entity associated with the command sender.
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `World getEntityWorld()` — Get the world, if available.
- `java.lang.String getName()` — Get the name of this object.
- `BlockPos getPosition()` — Get the position in the world.
- `Vec3 getPositionVector()` — Get the position vector.
- `boolean sendCommandFeedback()` — Returns true if the command sender should be sent feedback about executed commands
- `void setCommandStat(CommandResultStats.Type type, int amount)`