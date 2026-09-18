# AbstractAttributeMap

## Class signature

```java
public abstract class AbstractAttributeMap extends java.lang.Object
```

## Constructors

- `public AbstractAttributeMap()`

## Methods

- `public IAttributeInstance getAttributeInstance( IAttribute attribute)`
- `public IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `public IAttributeInstance registerAttribute( IAttribute attribute)`
- `protected abstract IAttributeInstance createInstance( IAttribute attribute)`
- `public java.util.Collection< IAttributeInstance > getAllAttributes()`
- `public void onAttributeModified( IAttributeInstance instance)`
- `public void removeAttributeModifiers(com.google.common.collect.Multimap<java.lang.String, AttributeModifier > modifiers)`
- `public void applyAttributeModifiers(com.google.common.collect.Multimap<java.lang.String, AttributeModifier > modifiers)`