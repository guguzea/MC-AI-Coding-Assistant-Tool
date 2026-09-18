# ILanguageAdapter

## Class signature

```java
public interface ILanguageAdapter
```

## Methods

- `java.lang.Object getNewInstance( FMLModContainer container, java.lang.Class<?> objectClass, java.lang.ClassLoader classLoader, java.lang.reflect.Method factoryMarkedAnnotation) throws java.lang.Exception`
- `boolean supportsStatics()`
- `void setProxy(java.lang.reflect.Field target, java.lang.Class<?> proxyTarget, java.lang.Object proxy) throws java.lang.IllegalArgumentException, java.lang.IllegalAccessException, java.lang.NoSuchFieldException, java.lang.SecurityException`
- `void setInternalProxies( ModContainer mod, Side side, java.lang.ClassLoader loader)`