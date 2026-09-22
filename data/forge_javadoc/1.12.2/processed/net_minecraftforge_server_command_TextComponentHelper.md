# TextComponentHelper

**Inheritance:** java.lang.Object → net.minecraftforge.server.command.TextComponentHelper

## Class signature

```java
public class TextComponentHelper extends java.lang.Object
```

## Methods

- `static TextComponentBase createComponentTranslation(ICommandSender sender, java.lang.String translation, java.lang.Object... args)` — Detects when sending to a vanilla client and falls back to sending english, since they don't have the lang data necessary to translate on the client.