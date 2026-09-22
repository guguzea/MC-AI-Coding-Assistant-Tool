# RegistryEvent.Register

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.eventhandler.GenericEvent<T> → net.minecraftforge.event.RegistryEvent<T> → net.minecraftforge.event.RegistryEvent.Register<T>

## Class signature

```java
public static class RegistryEvent.Register<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>
```

## Constructors

- `Register(ResourceLocation name, IForgeRegistry<T> registry)`

## Methods

- `ResourceLocation getName()`
- `IForgeRegistry<T> getRegistry()`