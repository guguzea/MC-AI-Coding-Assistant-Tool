# EntityOtherPlayerMP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer → net.minecraft.client.entity.EntityOtherPlayerMP

## Class signature

```java
public class EntityOtherPlayerMP extends AbstractClientPlayer
```

## Methods

- `void addChatMessage(IChatComponent component)` — Send a chat message to the CommandSender
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `BlockPos getPosition()` — Get the position in the world.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void setCurrentItemOrArmor(int slotIn, ItemStack stack)` — Sets the held item, or an armor slot.
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`

## Fields

- `EntityOtherPlayerMP`