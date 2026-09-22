# ModClassLoader

**Inheritance:** java.lang.Object → java.lang.ClassLoader → java.security.SecureClassLoader → java.net.URLClassLoader → net.minecraftforge.fml.common.ModClassLoader

## Class signature

```java
public class ModClassLoader extends java.net.URLClassLoader
```

## Constructors

- `ModClassLoader(java.lang.ClassLoader parent)`

## Methods

- `void addFile(java.io.File modFile)`
- `ModAPITransformer addModAPITransformer(ASMDataTable dataTable)`
- `void clearNegativeCacheFor(java.util.Set<java.lang.String> classList)`
- `boolean containsSource(java.io.File source)`
- `java.util.List<java.lang.String> getDefaultLibraries()`
- `java.io.File[] getParentSources()`
- `boolean isDefaultLibrary(java.io.File file)`
- `java.lang.Class<?> loadClass(java.lang.String name)`