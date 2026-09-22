# CapabilityDispatcher

**Inheritance:** java.lang.Object → net.minecraftforge.common.capabilities.CapabilityDispatcher

## Class signature

```java
public final class CapabilityDispatcher extends java.lang.Object implements INBTSerializable<NBTTagCompound>, ICapabilityProvider
```

## Constructors

- `CapabilityDispatcher(java.util.Map<ResourceLocation, ICapabilityProvider> list)`
- `CapabilityDispatcher(java.util.Map<ResourceLocation, ICapabilityProvider> list, ICapabilityProvider parent)`

## Methods

- `void deserializeNBT(NBTTagCompound nbt)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `NBTTagCompound serializeNBT()`