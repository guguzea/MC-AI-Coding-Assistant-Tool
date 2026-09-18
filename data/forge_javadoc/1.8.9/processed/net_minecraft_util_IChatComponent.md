# IChatComponent

## Class signature

```java
public interface IChatComponent extends java.lang.Iterable< IChatComponent >
```

## Methods

- `IChatComponent setChatStyle( ChatStyle style)`
- `ChatStyle getChatStyle()`
- `IChatComponent appendText(java.lang.String text)`
- `IChatComponent appendSibling( IChatComponent component)`
- `java.lang.String getUnformattedTextForChat()`
- `java.lang.String getUnformattedText()`
- `java.lang.String getFormattedText()`
- `java.util.List< IChatComponent > getSiblings()`
- `IChatComponent createCopy()`

## Description

Appends the given component to the end of this one.