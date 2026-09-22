# ChatAllowedCharacters

**Inheritance:** java.lang.Object → net.minecraft.util.ChatAllowedCharacters

## Class signature

```java
public class ChatAllowedCharacters extends java.lang.Object
```

## Constructors

- `ChatAllowedCharacters()`

## Methods

- `static java.lang.String filterAllowedCharacters(java.lang.String input)` — Filter string by only keeping those characters for which isAllowedCharacter() returns true.
- `static boolean isAllowedCharacter(char character)`

## Fields

- `static char[] allowedCharactersArray` — Array of the special characters that are allowed in any text drawing of Minecraft.