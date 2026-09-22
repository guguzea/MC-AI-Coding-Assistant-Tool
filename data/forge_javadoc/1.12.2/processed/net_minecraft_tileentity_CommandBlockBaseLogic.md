# CommandBlockBaseLogic

**Inheritance:** java.lang.Object → net.minecraft.tileentity.CommandBlockBaseLogic

## Class signature

```java
public abstract class CommandBlockBaseLogic extends java.lang.Object implements ICommandSender
```

## Constructors

- `CommandBlockBaseLogic()`

## Methods

- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `abstract void fillInInfo(ByteBuf buf)`
- `java.lang.String getCommand()`
- `abstract int getCommandBlockType()`
- `CommandResultStats getCommandResultStats()`
- `ITextComponent getLastOutput()`
- `java.lang.String getName()`
- `int getSuccessCount()`
- `void readDataFromNBT(NBTTagCompound nbt)`
- `boolean sendCommandFeedback()`
- `void sendMessage(ITextComponent component)`
- `void setCommand(java.lang.String command)`
- `void setCommandStat(CommandResultStats.Type type, int amount)`
- `void setLastOutput(ITextComponent lastOutputMessage)`
- `void setName(java.lang.String name)`
- `void setSuccessCount(int successCountIn)`
- `void setTrackOutput(boolean shouldTrackOutput)`
- `boolean shouldTrackOutput()`
- `boolean trigger(World worldIn)`
- `boolean tryOpenEditCommandBlock(EntityPlayer playerIn)`
- `abstract void updateCommand()`
- `NBTTagCompound writeToNBT(NBTTagCompound p_189510_1_)`