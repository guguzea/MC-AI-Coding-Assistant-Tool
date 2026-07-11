# Internationalization and localization

Internationalization, i18n for short, is a way of designing code so that it requires no changes to be adapted for various languages. Localization is the process of adapting displayed text to the user&rsquo;s language.

I18n is implemented using _*translation keys*_. A translation key is a string that identifies a piece of displayable text in no specific language. For example, `tile.dirt.name` is the translation key referring to the name of the Dirt block. This way, displayable text may be referenced with no concern for a specific language. The code requires no changes to be adapted in a new language.

Localization will happen in the game&rsquo;s locale. In a Minecraft client the locale is specified by the language settings. On a dedicated server, the only supported locale is en_US. A list of available locales can be found on the [Minecraft Wiki](https://minecraft.gamepedia.com/Language#Available_languages).

## Language files

Language files are located by `assets/[namespace]/lang/[locale].lang` (e.g. the US English translation for `examplemod` would be `assets/examplemod/lang/en_us.lang`). Resource pack format 3 (as specified in pack.mcmeta) requires the locale name to be lowercased. The file format is simply lines of key-value pairs separated by `=`. Lines starting with `#` are ignored. Lines without a separator are ignored. The file must be encoded in UTF-8.

```
# items
item.examplemod.example_item.name=Example Item Name

# blocks
tile.examplemod.example_block.name=Example Block Name

# commands
commands.examplemod.examplecommand.usage=/example <value>
```

Including the comment `#PARSE_ESCAPES` anywhere in the file will enable the slightly different and more complex Java properties file format. This format is required to support multiline values.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Enabling #PARSE_ESCAPES changes various aspects of the parsing. Among other things, the : character will be treated as a key-value separator. It must either be excluded from translation keys or escaped using \:.

## Usage with Blocks and Items


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note As of July 14th 2018, the term &ldquo;unlocalized name&rdquo; has been replaced by &ldquo;translation key&rdquo; in MCP.

Block, Item and a few other Minecraft classes have built-in translation keys used to display their names. These translation keys are specified by calling `setTranslationKey(String)` or by overriding `getTranslationKey()`. Item also has `getTranslationKey(ItemStack)` which can be overridden to provide different translation keys depending on ItemStack damage or NBT.

By default, `getTranslationKey()` will return `tile.` or `item.` prepended to whatever was set with `setTranslationKey(String)`, and ItemBlock will inherit the unlocalized name of its Block. Additionally, `.name` is always appended to the translation key before it is localized. For example `item.setTranslationKey("examplemod.example_item")` effectively requires the following line in a language file:

```
item.examplemod.example_item.name=Example Item Name
```


<!-- key:🟠 role:常见错误 -->

Unlike registry names, translation keys are not namespaced. It is therefore highly recommended to prefix your modid somewhere to the translation key (e.g. `examplemod.example_item`) to avoid naming conflicts. Otherwise, in the event of a conflict, the localization of one object will override the other.


<!-- key:🟠 role:常见错误 -->


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note The only purpose of a translation key is internationalization. Do not use them for logic. Use registry names instead. A common pattern is using getUnlocalizedName().substring(5) to assign registry names. This is fragile and uses the translation key for logic, which is considered bad practice. Consider setting the registry name first, then setting the translation key according to the registry name using MODID + "." + getRegistryName().getResourcePath().

## Localization methods


<!-- key:🔴 role:新手必读 (Warning) -->

> **Warning**: Warning A common issue is having the server localize for clients. The server can only localize in its own locale, which does not necessarily match the locale of connected clients. To respect the language settings of clients, the server should have clients localize text in their own locale using TextComponentTranslation or other methods preserving the language neutral translation keys.

### `net.minecraft.client.resources.I18n (client only)

**This I18n class can only be found on a Minecraft client!** It is intended to be used by code that only runs on the client. Attempts to use this on a server will throw exceptions and crash.

- <li><code>format(String, Object...)` localizes in the client&rsquo;s locale with formatting. The first parameter is a translation key, and the rest are formatting arguments for `String.format(String, Object...)`.


<!-- key:🟠 role:常见错误 -->

### `net.minecraft.util.text.translation.I18n (deprecated)


<!-- key:🟠 role:常见错误 -->

**This class is deprecated and should always be avoided.** It is intended to be used by code that runs on the logical server. Because localization should rarely happen on the server, other alternatives should be considered.

- <li><code>translateToLocal(String)` localizes in the game&rsquo;s locale without formatting. The parameter is a translation key.
- <li>`translateToLocalFormatted(String, Object...)` localizes in the game&rsquo;s locale with formatting. The first parameter is a translation key, and the rest are used as formatting arguments for `String.format(String, Object...)`.

### `TextComponentTranslation

<code>TextComponentTranslation` is an `ITextComponent` that is localized and formatted lazily. It is very useful when sending messages to players because it will be automatically localized in their own locale.

The first parameter of the `TextComponentTranslation(String, Object...)` constructor is a translation key, and the rest are used for formatting. The only supported format specifiers are `%s` and `%1$s`, `%2$s`, `%3$s` etc. Formatting arguments may be other `ITextComponent`s that will be inserted into the resulting formatted text with all their attributes preserved.

### `TextComponentHelper

- <li><code>createComponentTranslation(ICommandSender, String, Object...)` creates a localized and formatted `ITextComponent` depending on a receiver. The localization and formatting is done eagerly if the receiver is a vanilla client. If not, the localization and formatting is done lazily with a `TextComponentTranslation`. This is only useful if the server should allow vanilla clients to connect.