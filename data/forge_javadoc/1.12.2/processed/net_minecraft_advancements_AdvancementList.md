# AdvancementList

## Class signature

```java
public class AdvancementList extends java.lang.Object
```

## Constructors

- `public AdvancementList()`

## Methods

- `public void removeAll(java.util.Set< ResourceLocation > ids)`
- `public void loadAdvancements(java.util.Map< ResourceLocation , Advancement.Builder > advancementsIn)`
- `public void clear()`
- `public java.lang.Iterable< Advancement > getRoots()`
- `public java.lang.Iterable< Advancement > getAdvancements()`
- `public Advancement getAdvancement( ResourceLocation id)`
- `public void setListener( AdvancementList.Listener listenerIn)`