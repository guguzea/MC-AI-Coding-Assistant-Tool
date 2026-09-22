# ServersideAttributeMap

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.BaseAttributeMap → net.minecraft.entity.ai.attributes.ServersideAttributeMap

## Class signature

```java
public class ServersideAttributeMap extends BaseAttributeMap
```

## Constructors

- `ServersideAttributeMap()`

## Methods

- `protected IAttributeInstance func_180376_c(IAttribute p_180376_1_)`
- `void func_180794_a(IAttributeInstance p_180794_1_)`
- `ModifiableAttributeInstance getAttributeInstance(IAttribute attribute)`
- `ModifiableAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `java.util.Set<IAttributeInstance> getAttributeInstanceSet()`
- `java.util.Collection<IAttributeInstance> getWatchedAttributes()`
- `IAttributeInstance registerAttribute(IAttribute attribute)` — Registers an attribute with this AttributeMap, returns a modifiable AttributeInstance associated with this map

## Fields

- `protected java.util.Map<java.lang.String, IAttributeInstance> descriptionToAttributeInstanceMap`