# JsonException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.io.IOException → net.minecraft.client.util.JsonException

## Class signature

```java
public class JsonException extends java.io.IOException
```

## Constructors

- `JsonException(java.lang.String messageIn)`
- `JsonException(java.lang.String messageIn, java.lang.Throwable cause)`

## Methods

- `static JsonException forException(java.lang.Exception p_151379_0_)`
- `java.lang.String getMessage()`
- `void prependJsonKey(java.lang.String p_151380_1_)`
- `void setFilenameAndFlush(java.lang.String p_151381_1_)`