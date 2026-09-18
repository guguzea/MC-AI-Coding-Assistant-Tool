# TextComponentHelper

## Class signature

```java
public class TextComponentHelper extends java.lang.Object
```

## Methods

- `public static TextComponentBase createComponentTranslation( ICommandSender sender, java.lang.String translation, java.lang.Object... args)`

## Description

Detects when sending to a vanilla client and falls back to sending english, since they don't have the lang data necessary to translate on the client.