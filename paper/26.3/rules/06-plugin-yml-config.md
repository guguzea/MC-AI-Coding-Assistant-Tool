# 06 — `plugin.yml` 与配置

## `plugin.yml` 的 `api-version`（**本次实测真值**）

**`api-version: '26.3'` 被 Paper 26.3-190 接受** —— 真机跑加载插件时无任何加载期报错（日志：`Loading server plugin … v1.0.0` → `Enabling …` → `… enabled`）。

⇒ 服务端发行件版本 `26.3-190` 对应可写 `'26.3'`。**这条此前是占位符（`TODO-未核实`），2026-10-15 起有实测真值。**

⚠ 仍是**单点实测**：本档**没试过**别的取值、也没历史档对照。

## 配置面（逐字签名，全核过）

`JavaPlugin.md`：

| 行 | 签名 |
|---|---|
| `:15` | `@NotNull public final File getDataFolder()` |
| `:21` | `@NotNull public FileConfiguration getConfig()` |
| `:23` | `public void reloadConfig()` |
| `:24` | `public void saveConfig()` |
| `:25` | `public void saveDefaultConfig()` |

**从签名读得出的一条**：`getConfig()` 返回 `@NotNull` ⇒ 不需要判空；而它背后读的是 `getDataFolder()` 下的配置（`:15` 与 `:21` 同批出现，是插件数据目录）。

## `plugin.yml` 的字段（**官方出处已核，2026-10-15**）

`getting-started__plugin-yml.md`：

| 行 | 字段 | 官方原文要点 |
|---|---|---|
| `:97-102` | `api-version` | "**The valid versions are 1.13 - {LATEST_PAPER_RELEASE}**" ⇒ 这与本档的**真机实测**（`'26.3'` 被接受）一致 |
| `:112-113` | `load` | "when to load the plugin. This can be **`STARTUP`** or **`POSTWORLD`**. Will **default to `POSTWORLD`** if not specified." |
| `:225-235` | **`depend`** | "A list of plugins that your plugin depends on to **__load__**" ⇒ **被依赖者先加载** |
| `:237-241` | `softdepend` | "…depends on to have **__full functionality__**"（不是加载前提） |
| `:120-123` | `libraries` | 从 **Maven Central** 下载并加进 classpath（"removes the need to shade and relocate"） |
| `:252-254` | `provides` | 声明本插件**提供**某库/插件的功能（别名系统）；`(soft)depend` 它的插件会当它存在 |

⚠️ **纠错**：我先前把加载顺序那条写成 **`hard-depend`** —— **`plugin.yml` 里没有这个字段名**，官方是 **`depend`**（`:225`）。别照我先前那句记。

**加载顺序（官方原文）** `:206-208`：`## Dependencies` → "**If a plugin is specified as a dependency, it will be loaded before your plugin**"，并警告**循环依赖**会让加载出问题。

## `saveDefaultConfig()` 干什么（**官方出处已核**）

`api__plugin-configs.md:55` 与 `:58-59` —— 官方**就给了等价写法**：

```java
this.saveResource("config.yml", /* replace */ false);
// 等价简写（官方注释逐字）：
// this.saveDefaultConfig();
// the file will be saved if it does not already exist
```

⇒ **语义 = 把 jar 内 `config.yml` 拷到数据目录，已存在则不覆盖**（`:32-34` 说默认值放 `resources/` 下的 `config.yml`）。取配置用 `Plugin#getConfig()`（`:75-76`）。

## `FileConfiguration` 的 getter 在**接口 `ConfigurationSection`** 上（**已核**）

实测：`org_bukkit_configuration_file_FileConfiguration.md` 与 `org_bukkit_configuration_MemoryConfiguration.md` 里搜这些 getter **都 0 命中** ⇒ 它们在 **`org_bukkit_configuration_ConfigurationSection.md`**：

| 行 | 签名 |
|---|---|
| `:17` | `boolean isSet(@NotNull String path)` |
| `:27` / `:28` | `@Nullable String getString(@NotNull String path)` / `(String path, @Nullable String def)`（后者带 `@Contract("_, !null -> !null")`） |
| `:30` / `:31` | `int getInt(String path)` / `int getInt(String path, int def)` |
| `:33` / `:34` | `boolean getBoolean(String path)` / `(String path, boolean def)` |
| `:45-47` | `getStringList` / `getIntegerList` / `getBooleanList`（均 `@NotNull`） |
| `:74` | `@Nullable ConfigurationSection getConfigurationSection(@NotNull String path)` |

⇒ **教训**：签名页**只列本类声明的成员** ⇒ 找 getter 要**沿继承链**（`FileConfiguration` → … → `ConfigurationSection`）。

## `commands` 的完整结构（**官方出处已核，2026-10-15**）

`getting-started__plugin-yml.md:188` 与 `:190-196` —— 官方示例逐字（⚠ 该段第 197 行是空行，故不写整段区间）：

```yaml
commands:
  command:
    description: "This is a command"
    usage: "/command <arg>"
    aliases: [cmd, command]
    permission: permission.node
    permission-message: "You do not have permission to use this command"
```

| 字段 | 官方原文要点 |
|---|---|
| `description` | 命令的简述 |
| `usage` | **`/help <command>` 里显示**的就是它 |
| `aliases` | 别名列表（用来缩短命令） |
| `permission` | 用该命令所需的权限节点 —— ⚠ **"Players will only see commands they have permission to use"**（**没权限的连命令都不显示**） |
| `permission-message` | 没权限时的提示语 |

**另两条长尾**：`:250-255` **`provides: [SomeOtherPlugin]`**（声明"本插件提供某库/插件的功能"，`(soft)depend` 它的插件会当它存在）· `:75-76` **`description`**（显示在 plugin info 命令里）。

⚠ **官方 `:142-149` 的权限示例用的就是 `default: op` 与 `default: notop`** —— **印证**了 `04-permissions.md` 里那条"官方写法是 `notop`（无空格）"。

## 未核实

- 下面两个 **Paper 专有**字段本档**未在真机试过**（只核了官方页确有该节）。
- `plugin.yml` 的**极长尾**（本档未覆盖的写法，如自定义 `permissions` 的 `children` 树）未逐条核。

## 先前**漏记**的四个字段（**官方出处已核，2026-10-16 · 逐节扫 `###` 标题**）

对官方页扫出全部 `###` 小节标题后，发现本档先前漏了这四个：

| 行 | 字段 | 说明 |
|---|---|---|
| `:85` | **`contributors`** | 与 `author`（`:78`）/ `authors` 并列的**第三个署名位** |
| `:243` | **`loadbefore`** | 与 `depend`（`:225`）/ `softdepend`（`:237`）/ `provides`（`:250`）同族 —— **本插件要先于它加载**（方向与 `depend` 相反） |
| `:162` | **`paper-plugin-loader`** | **Paper 专有**（Paper 在 `plugin.yml` 上的扩展） |
| `:173` | **`paper-skip-libraries`** | **Paper 专有** —— 跳过 `libraries`（`:120`）的解析/下载 |

⇒ 至此官方页的 `###` 小节**全部覆盖**：`name*` `version*` `main*` `description` `author/authors` `contributors` `website` `api-version` `load` `prefix` `libraries` `permissions` `default-permission` `paper-plugin-loader` `paper-skip-libraries` `depend` `softdepend` `loadbefore` `provides`（`*` = 必填）。

## 其余字段（**官方出处已核，2026-10-15**）

`getting-started__plugin-yml.md`：

| 行 | 字段 | 官方原文要点 |
|---|---|---|
| `:78-83` | **`author` / `authors`** | 单个或多个作者两种写法：`author: PaperMC` 或 `authors: [PaperMC, Bukkit]`；「shown in the plugin info commands」 |
| `:91-95` | `website` | 用来链 GitHub/插件页 |
| `:115-118` | **`prefix`** | 显示在日志里**替代插件名**（`name` 会被它覆盖 —— 见 `:57-58`） |
| `:137-153` | `permissions` | 结构 = `permissions: { <node>: { description, default } }` |
| `:157-160` | **`default-permission`** | 给**没写 `default` 的**权限节点定默认值（`op`/`notop` 或 `true`/`false`） |
| `:188-190` | `commands` | 命令段结构（`:189` `commands:` / `:190` `command:`） |

⚠ **一条"官方 vs 实测"对照，值得单独记**：官方 `:152-153` 说 `default` 的字面量是 **`op` / `notop`**（**无空格**）；而本档**真机实测**的是 **`not op`（带空格）也生效**（marker `v-perm-declared-more.ok`）。⇒ **我只实测了带空格那种**，两种写法是否都接受**未同时对照**（见 `04-permissions.md`）。
- `Permission` 在 `plugin.yml` 里的 `default:` 字面量与 `PermissionDefault` 的映射 —— 见 `04-permissions.md` 的「`plugin.yml` 的权限声明」节（已真机核）。
