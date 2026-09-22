# IExtendedEntityProperties

## Class signature

```java
public interface IExtendedEntityProperties
```

## Methods

- `void init(Entity entity, World world)` — Used to initialize the extended properties with the entity that this is attached to, as well as the world object.
- `void loadNBTData(NBTTagCompound compound)` — Called when the entity that this class is attached to is loaded.
- `void saveNBTData(NBTTagCompound compound)` — Called when the entity that this class is attached to is saved.