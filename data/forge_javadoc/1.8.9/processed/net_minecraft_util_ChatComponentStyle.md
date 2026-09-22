# ChatComponentStyle

**Inheritance:** java.lang.Object → net.minecraft.util.ChatComponentStyle

## Class signature

```java
public abstract class ChatComponentStyle extends java.lang.Object implements IChatComponent
```

## Constructors

- `ChatComponentStyle()`

## Methods

- `IChatComponent appendSibling(IChatComponent component)` — Appends the given component to the end of this one.
- `IChatComponent appendText(java.lang.String text)` — Appends the given text to the end of this component.
- `static java.util.Iterator<IChatComponent> createDeepCopyIterator(java.lang.Iterable<IChatComponent> components)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `ChatStyle getChatStyle()`
- `java.lang.String getFormattedText()` — Gets the text of this component, with formatting codes added for rendering.
- `java.util.List<IChatComponent> getSiblings()`
- `java.lang.String getUnformattedText()` — Get the text of this component, and all child components , with all special formatting codes removed.
- `int hashCode()`
- `java.util.Iterator<IChatComponent> iterator()`
- `IChatComponent setChatStyle(ChatStyle style)`
- `java.lang.String toString()`

## Fields

- `protected java.util.List<IChatComponent> siblings`