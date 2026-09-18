# AttributeMap

## Class signature

```java
public class AttributeMap extends AbstractAttributeMap
```

## Constructors

- `public AttributeMap()`

## Methods

- `public ModifiableAttributeInstance getAttributeInstance( IAttribute attribute)`
- `public ModifiableAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `public IAttributeInstance registerAttribute( IAttribute attribute)`
- `protected IAttributeInstance createInstance( IAttribute attribute)`
- `public void onAttributeModified( IAttributeInstance instance)`
- `public java.util.Set< IAttributeInstance > getDirtyInstances()`
- `public java.util.Collection< IAttributeInstance > getWatchedAttributes()`