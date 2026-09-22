# AbstractAttributeMap

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.AbstractAttributeMap

## Class signature

```java
public abstract class AbstractAttributeMap extends java.lang.Object
```

## Constructors

- `AbstractAttributeMap()`

## Methods

- `void applyAttributeModifiers(<any> modifiers)`
- `protected abstract IAttributeInstance createInstance(IAttribute attribute)`
- `java.util.Collection<IAttributeInstance> getAllAttributes()`
- `IAttributeInstance getAttributeInstance(IAttribute attribute)`
- `IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `void onAttributeModified(IAttributeInstance instance)`
- `IAttributeInstance registerAttribute(IAttribute attribute)`
- `void removeAttributeModifiers(<any> modifiers)`

## Fields

- `protected java.util.Map<IAttribute, IAttributeInstance> attributes`
- `protected java.util.Map<java.lang.String, IAttributeInstance> attributesByName`
- `protected<any> descendantsByParent`