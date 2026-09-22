# FMLControlledNamespacedRegistry

**Inheritance:** java.lang.Object → net.minecraft.util.RegistrySimple → net.minecraft.util.RegistryNamespaced → cpw.mods.fml.common.registry.FMLControlledNamespacedRegistry<I>

## Class signature

```java
public class FMLControlledNamespacedRegistry<I> extends RegistryNamespaced
```

## Methods

- `@Deprecated void addObject(int id, java.lang.String name, java.lang.Object thing)` — Deprecated. register through GameRegistry instead.
- `@Deprecated boolean contains(java.lang.String itemName)` — Deprecated. use containsKey instead
- `boolean containsKey(java.lang.String name)` — Determine if the registry has an entry for the specified name.
- `@Deprecated I get(int id)` — Deprecated. use getObjectById instead
- `@Deprecated I get(java.lang.String name)` — Deprecated. use getObject instead
- `java.util.Map<java.lang.String, java.lang.String> getAliases()`
- `I getDefaultValue()`
- `RegistryDelegate<I> getDelegate(I thing, java.lang.Class<I> clazz)`
- `int getId(I thing)` — Get the id for the specified object.
- `int getId(java.lang.String itemName)` — Get the id for the specified object.
- `I getObject(java.lang.String name)` — Fetch the object identified by the specified name or the default object.
- `I getObjectById(int id)` — Fetch the object identified by the specified id or the default object.
- `I getRaw(int id)` — Get the object identified by the specified id.
- `I getRaw(java.lang.String name)` — Get the object identified by the specified name.
- `java.util.Iterator<I> iterator()`
- `@Deprecated void putObject(java.lang.Object objName, java.lang.Object obj)` — Deprecated. register through GameRegistry instead.
- `void serializeInto(java.util.Map<java.lang.String, java.lang.Integer> idMapping)`
- `void serializeSubstitutions(java.util.Set<java.lang.String> blockSubs)`
- `java.lang.Iterable<I> typeSafeIterable()`

## Fields

- `static boolean DEBUG`