# FMLDeobfuscatingRemapper

## Class signature

```java
public class FMLDeobfuscatingRemapper extends Remapper
```

## Methods

- `public void setupLoadOnly(java.lang.String deobfFileName, boolean loadAll)`
- `public void setup(java.io.File mcDir, LaunchClassLoader classLoader, java.lang.String deobfFileName)`
- `public boolean isRemappedClass(java.lang.String className)`
- `public java.lang.String mapFieldName(java.lang.String owner, java.lang.String name, java.lang.String desc)`
- `public java.lang.String map(java.lang.String typeName)`
- `public java.lang.String unmap(java.lang.String typeName)`
- `public java.lang.String mapMethodName(java.lang.String owner, java.lang.String name, java.lang.String desc)`
- `public void mergeSuperMaps(java.lang.String name, java.lang.String superName, java.lang.String[] interfaces)`
- `public java.util.Set<java.lang.String> getObfedClasses()`
- `public java.lang.String getStaticFieldType(java.lang.String oldType, java.lang.String oldName, java.lang.String newType, java.lang.String newName)`