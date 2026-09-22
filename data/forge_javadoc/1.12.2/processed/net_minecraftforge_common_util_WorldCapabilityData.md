# WorldCapabilityData

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldSavedData → net.minecraftforge.common.util.WorldCapabilityData

## Class signature

```java
public class WorldCapabilityData extends WorldSavedData
```

## Constructors

- `WorldCapabilityData(INBTSerializable<NBTTagCompound> serializable)`
- `WorldCapabilityData(java.lang.String name)`

## Methods

- `boolean isDirty()`
- `void readFromNBT(NBTTagCompound nbt)`
- `void setCapabilities(WorldProvider provider, INBTSerializable<NBTTagCompound> capabilities)`
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`

## Fields

- `static java.lang.String ID`