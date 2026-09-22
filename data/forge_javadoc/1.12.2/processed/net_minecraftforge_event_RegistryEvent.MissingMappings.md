# RegistryEvent.MissingMappings

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.eventhandler.GenericEvent<T> → net.minecraftforge.event.RegistryEvent<T> → net.minecraftforge.event.RegistryEvent.MissingMappings<T>

## Class signature

```java
public static class RegistryEvent.MissingMappings<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>
```

## Constructors

- `MissingMappings(ResourceLocation name, IForgeRegistry<T> registry, java.util.Collection<RegistryEvent.MissingMappings.Mapping<T>> missed)`

## Methods

- `<any> getAllMappings()`
- `<any> getMappings()`
- `ResourceLocation getName()`
- `IForgeRegistry<T> getRegistry()`
- `void setModContainer(ModContainer mod)`