# BlockState.StateImplementation

## Constructors

- `protected StateImplementation( Block blockIn, <any> propertiesIn)`
- `protected StateImplementation( Block blockIn, <any> propertiesIn, <any> propertyValueTable)`

## Methods

- `public java.util.Collection< IProperty > getPropertyNames()`
- `public <T extends java.lang.Comparable<T>> T getValue( IProperty <T> property)`
- `public <T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `public <any> getProperties()`
- `public Block getBlock()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void buildPropertyValueTable(java.util.Map<java.util.Map< IProperty ,java.lang.Comparable>, BlockState.StateImplementation > map)`
- `public <any> getPropertyValueTable()`