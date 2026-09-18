# MapGenStructureIO

## Class signature

```java
public class MapGenStructureIO extends java.lang.Object
```

## Constructors

- `public MapGenStructureIO()`

## Methods

- `public static void registerStructure(java.lang.Class<? extends StructureStart > startClass, java.lang.String structureName)`
- `public static void registerStructureComponent(java.lang.Class<? extends StructureComponent > componentClass, java.lang.String componentName)`
- `public static java.lang.String getStructureStartName( StructureStart start)`
- `public static java.lang.String getStructureComponentName( StructureComponent component)`
- `public static StructureStart getStructureStart( NBTTagCompound tagCompound, World worldIn)`
- `public static StructureComponent getStructureComponent( NBTTagCompound tagCompound, World worldIn)`