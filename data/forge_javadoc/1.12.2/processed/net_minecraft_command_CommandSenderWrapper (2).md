# CommandSenderWrapper

## Class signature

```java
public class CommandSenderWrapper extends java.lang.Object implements ICommandSender
```

## Constructors

- `public CommandSenderWrapper( ICommandSender delegateIn, Vec3d positionVectorIn, BlockPos positionIn, java.lang.Integer permissionLevelIn, Entity entityIn, java.lang.Boolean sendCommandFeedbackIn)`

## Methods

- `public static CommandSenderWrapper create( ICommandSender sender)`
- `public CommandSenderWrapper withEntity( Entity entityIn, Vec3d p_193997_2_)`
- `public CommandSenderWrapper withPermissionLevel(int level)`
- `public CommandSenderWrapper withSendCommandFeedback(boolean sendCommandFeedbackIn)`
- `public CommandSenderWrapper computePositionVector()`
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