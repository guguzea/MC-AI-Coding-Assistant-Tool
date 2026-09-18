# ModifiableAttributeInstance

## Class signature

```java
public class ModifiableAttributeInstance extends java.lang.Object implements IAttributeInstance
```

## Constructors

- `public ModifiableAttributeInstance( AbstractAttributeMap attributeMapIn, IAttribute genericAttributeIn)`

## Methods

- `public IAttribute getAttribute()`
- `public double getBaseValue()`
- `public void setBaseValue(double baseValue)`
- `public java.util.Collection< AttributeModifier > getModifiersByOperation(int operation)`
- `public java.util.Collection< AttributeModifier > getModifiers()`
- `public AttributeModifier getModifier(java.util.UUID uuid)`
- `public boolean hasModifier( AttributeModifier modifier)`
- `public void applyModifier( AttributeModifier modifier)`
- `protected void flagForUpdate()`
- `public void removeModifier( AttributeModifier modifier)`
- `public void removeModifier(java.util.UUID p_188479_1_)`
- `public void removeAllModifiers()`
- `public double getAttributeValue()`