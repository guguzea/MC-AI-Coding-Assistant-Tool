# PersistentRegistryManager.GameDataSnapshot.Entry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.PersistentRegistryManager.GameDataSnapshot.Entry

## Class signature

```java
public static class PersistentRegistryManager.GameDataSnapshot.Entry extends java.lang.Object
```

## Constructors

- `Entry()`
- `Entry(FMLControlledNamespacedRegistry<?> registry)`
- `Entry(java.util.Map<ResourceLocation, java.lang.Integer> ids, java.util.Set<ResourceLocation> substitutions, java.util.Map<ResourceLocation, ResourceLocation> aliases, java.util.Set<java.lang.Integer> blocked, java.util.Set<ResourceLocation> dummies)`

## Fields

- `java.util.Map<ResourceLocation, ResourceLocation> aliases`
- `java.util.Set<java.lang.Integer> blocked`
- `java.util.Set<ResourceLocation> dummied`
- `java.util.Map<ResourceLocation, java.lang.Integer> ids`
- `java.util.Set<ResourceLocation> substitutions`