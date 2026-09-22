# AdvancementList

**Inheritance:** java.lang.Object → net.minecraft.advancements.AdvancementList

## Class signature

```java
public class AdvancementList extends java.lang.Object
```

## Constructors

- `AdvancementList()`

## Methods

- `void clear()`
- `Advancement getAdvancement(ResourceLocation id)`
- `java.lang.Iterable<Advancement> getAdvancements()`
- `java.lang.Iterable<Advancement> getRoots()`
- `void loadAdvancements(java.util.Map<ResourceLocation, Advancement.Builder> advancementsIn)`
- `void removeAll(java.util.Set<ResourceLocation> ids)`
- `void setListener(AdvancementList.Listener listenerIn)`