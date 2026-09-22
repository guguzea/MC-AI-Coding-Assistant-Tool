# Capability

**Inheritance:** java.lang.Object → net.minecraftforge.common.capabilities.Capability<T>

## Class signature

```java
public class Capability<T> extends java.lang.Object
```

## Methods

- `<R> R cast(T instance)` — Use this inside ICapabilityProvider.getCapability to avoid unchecked cast warnings.
- `T getDefaultInstance()` — A NEW instance of the default implementation.
- `java.lang.String getName()`
- `Capability.IStorage<T> getStorage()`
- `void readNBT(T instance, EnumFacing side, NBTBase nbt)` — Quick access to the IStorage's readNBT.
- `NBTBase writeNBT(T instance, EnumFacing side)` — Quick access to the IStorage's writeNBT.