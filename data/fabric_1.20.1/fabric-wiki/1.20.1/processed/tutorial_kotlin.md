> 来源：https://fabricmc.net/wiki/doku.php?id=tutorial:kotlin
> 版本：1.20.1
> 页面 ID：tutorial:kotlin
> 优先级：🟡
> 抓取源：wiki_raw

# Using Kotlin with Fabric
**WARNING: this document assumes you have prior knowledge of Java (and a bit of JVM and Gradle). THIS IS NOT A KOTLIN LANGUAGE TUTORIAL, for that see https://kotlinlang.org/docs/getting-started.html|the official Kotlin site.**

https://kotlinlang.org/|Kotlin is a very powerful language which highly integrates with Java and can be executed on a JVM (it's compiled down to Java but you can write interop java and kotlin code in one project). This means, that you can use Kotlin for development of Minecraft fabric mods!

## Advantage of using Kotlin
  * Far less boilerplate.
  * Easy to use lambdas.
  * A lot of syntax sugar that makes coding easier.
  * Automatic type inference (compiler can determine a type of variable based on it's usage)
  * Null-safety out of the box using nullable and not-nullable types (e.g. not-nullable Int vs nullable Int?)
  * Extension functions, i.e. functions that seem to be "added" to existing types (it's a syntax sugar but a useful one)
  * Operator overloading
  * Good separation between mutable (var) and immutable (val) data which promotes good code practices
  * Support for better functional programming patterns
  * Anonymous objects (without class declarations) and data classes (simple value holders)
  * Type variance and covariance, no wildcard generic types
  * String templates (like "length of string is ${s.length}")
  * A ton of utility functions
  * ...and a lot more 

For a more comprehensive comparison of Kotlin vs Java https://kotlinlang.org/docs/comparison-to-java.html#some-java-issues-addressed-in-kotlin|visit the official site.

The following steps assume you're using the latest version of https://www.jetbrains.com/idea/|IntellIJ IDEA.

## Limitations
  * You cannot use kotlin files for mixins.
  * I REPEAT, YOU **CANNOT** USE KOTLIN FILES FOR MIXINS... 
  * ...But, you can redirect a code to invoke a function marked with @JvmStatic annotation, to a method in an object or companion object from a Java mixin.

## Step 1: Configure/Initialize mod
Create your mod as you usually do — see [creating mod](tutorial:start). If you already have a mod configured, go to next step.

## Step 2: Configure Kotlin using IntellIJ's Action
This step essentially boils down to using a "Configure Kotlin in Project" Action which you can access via (Tools -> Kotlin -> Configure Kotlin in Project) menu item, a quick-action menu (Shift, Shift and search for "Configure Kotlin...") or a shortcut (Ctrl+Alt+Shift+K or Command+Option+Shift+K). 

This is the easiest method of configuring it, especially when used with the https://plugins.jetbrains.com/plugin/8327-minecraft-development|Minecraft Development plugin which doesn't support the Kotlin template. This will apply the appropriate Kotlin plugin for gradle and add dependencies for Kotlin language.

Finally, sync gradle project (two arrows icon tn the Gradle toolbar or with Ctrl+Shift+O when a gradle file is opened).

You should be able to use Kotlin at this point.

## Step 3 (recommended): Modify gradle file to add fabric kotlin modding library
### Add the official kotlin fabric library to your `build.gradle` file
The previous step added a dependency on kotlin stdlib. You can use https://github.com/FabricMC/fabric-language-kotlin|an official fabric-language-kotlin dependency to add more extensive kotlin support for your mod. With this dependency, some core and some extra packages for kotlin will automatically be added to the project, and you shall be spared of wasting your time with manually shadowing entire Kotlin classes.

To do this, replace
<code groovy>
dependencies {
   //... 
   implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
}
</code>
with
<code groovy>
dependencies {
   //...
   modImplementation("net.fabricmc:fabric-language-kotlin:1.10.8+kotlin.1.9.0")
}
</code>

(Use appropriate version, which can be found on https://github.com/FabricMC/fabric-language-kotlin|the official github)


<!-- key:🟠 role:常见错误 -->

Do not forget to modify your fabric.mod.json as stated in their https://github.com/FabricMC/fabric-language-kotlin|README.md:

<code json>
{
    "schemaVersion":  1, 
    "entrypoints": {
        "main": [
            {
                "adapter": "kotlin",
                "value": "package.ClassName"
            }
        ]
    },
    "depends": {
        "fabric-language-kotlin": ">=1.10.8+kotlin.1.9.0"
    }
}
</code>

You can also modify mod entrypoints to allow for top-level functions, fields, methods or function references to work. Check the documentation of entrypoints in their https://github.com/FabricMC/fabric-language-kotlin|README.md.

### Increasing version of jvmToolchain
Some errors may appear when compiling Kotlin, so it's a good idea to increase the version of jvmToolcahin depending on your mc version (kotlin compiles down to java 8 by default):

<code groovy>
jvmToolchain(11)
</code>

You should be able to use 11 for versions below 1.17, 16 for 1.17 and 17 since 1.18.