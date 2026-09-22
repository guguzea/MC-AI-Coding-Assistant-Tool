# MapGenStructureIO

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.MapGenStructureIO

## Class signature

```java
public class MapGenStructureIO extends java.lang.Object
```

## Constructors

- `MapGenStructureIO()`

## Methods

- `static StructureComponent getStructureComponent(NBTTagCompound tagCompound, World worldIn)`
- `static java.lang.String getStructureComponentName(StructureComponent component)`
- `static StructureStart getStructureStart(NBTTagCompound tagCompound, World worldIn)`
- `static java.lang.String getStructureStartName(StructureStart start)`
- `static void registerStructure(java.lang.Class<? extends StructureStart> startClass, java.lang.String structureName)`
- `static void registerStructureComponent(java.lang.Class<? extends StructureComponent> componentClass, java.lang.String componentName)`