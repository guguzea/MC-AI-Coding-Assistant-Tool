# AttributeMap

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.AbstractAttributeMap → net.minecraft.entity.ai.attributes.AttributeMap

## Class signature

```java
public class AttributeMap extends AbstractAttributeMap
```

## Constructors

- `AttributeMap()`

## Methods

- `protected IAttributeInstance createInstance(IAttribute attribute)`
- `ModifiableAttributeInstance getAttributeInstance(IAttribute attribute)`
- `ModifiableAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `java.util.Set<IAttributeInstance> getAttributeInstanceSet()`
- `java.util.Collection<IAttributeInstance> getWatchedAttributes()`
- `void onAttributeModified(IAttributeInstance instance)`
- `IAttributeInstance registerAttribute(IAttribute attribute)`

## Fields

- `protected java.util.Map<java.lang.String, IAttributeInstance> descriptionToAttributeInstanceMap`