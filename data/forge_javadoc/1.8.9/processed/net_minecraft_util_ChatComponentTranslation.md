# ChatComponentTranslation

**Inheritance:** java.lang.Object → net.minecraft.util.ChatComponentStyle → net.minecraft.util.ChatComponentTranslation

## Class signature

```java
public class ChatComponentTranslation extends ChatComponentStyle
```

## Constructors

- `ChatComponentTranslation(java.lang.String translationKey, java.lang.Object... args)`

## Methods

- `ChatComponentTranslation createCopy()` — Creates a copy of this component.
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.Object[] getFormatArgs()`
- `java.lang.String getKey()`
- `java.lang.String getUnformattedTextForChat()` — Gets the text of this component, without any special formatting codes added, for chat.
- `int hashCode()`
- `protected void initializeFromFormat(java.lang.String format)` — initializes our children from a format string, using the format args to fill in the placeholder variables.
- `java.util.Iterator<IChatComponent> iterator()`
- `IChatComponent setChatStyle(ChatStyle style)`
- `java.lang.String toString()`

## Fields

- `static java.util.regex.Pattern stringVariablePattern`