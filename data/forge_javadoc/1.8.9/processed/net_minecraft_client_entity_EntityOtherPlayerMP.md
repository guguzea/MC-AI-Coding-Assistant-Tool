# EntityOtherPlayerMP

## Class signature

```java
public class EntityOtherPlayerMP extends AbstractClientPlayer
```

## Constructors

- `public EntityOtherPlayerMP( World worldIn, GameProfile gameProfileIn)`

## Methods

- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public void onUpdate()`
- `public void onLivingUpdate()`
- `public void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public void addChatMessage( IChatComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public BlockPos getPosition()`

## Description

Send a chat message to the CommandSender