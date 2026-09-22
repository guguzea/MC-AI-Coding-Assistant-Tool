# IFieldWrapper

## Class signature

```java
public interface IFieldWrapper
```

## Methods

- `java.lang.String getCategory()` — i.e. general.map in the example above
- `java.lang.String[] getKeys()`
- `net.minecraftforge.common.config.ITypeAdapter getTypeAdapter()`
- `java.lang.Object getValue(java.lang.String key)`
- `boolean handlesKey(java.lang.String key)`
- `boolean hasKey(java.lang.String key)`
- `@Deprecated void setupConfiguration(Configuration cfg, java.lang.String desc, java.lang.String langKey, boolean reqMCRestart, boolean reqWorldRestart)`
- `default void setupConfiguration(Configuration cfg, java.lang.String desc, java.lang.String langKey, boolean reqMCRestart, boolean reqWorldRestart, boolean hasSlidingControl)`
- `void setValue(java.lang.String key, java.lang.Object value)`