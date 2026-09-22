# WorldSavedData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData

## Class signature

```java
public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable<NBTTagCompound>
```

## Constructors

- `WorldSavedData(java.lang.String name)`

## Methods

- `void deserializeNBT(NBTTagCompound nbt)`
- `boolean isDirty()`
- `void markDirty()`
- `abstract void readFromNBT(NBTTagCompound nbt)`
- `NBTTagCompound serializeNBT()`
- `void setDirty(boolean isDirty)`
- `abstract NBTTagCompound writeToNBT(NBTTagCompound p_189551_1_)`

## Fields

- `java.lang.String mapName`