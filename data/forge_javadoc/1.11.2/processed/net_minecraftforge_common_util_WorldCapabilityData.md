# WorldCapabilityData

## Class signature

```java
public class WorldCapabilityData extends WorldSavedData
```

## Constructors

- `public WorldCapabilityData(java.lang.String name)`
- `public WorldCapabilityData( INBTSerializable < NBTTagCompound > serializable)`

## Methods

- `public void readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound nbt)`
- `public boolean isDirty()`
- `public void setCapabilities( WorldProvider provider, INBTSerializable < NBTTagCompound > capabilities)`