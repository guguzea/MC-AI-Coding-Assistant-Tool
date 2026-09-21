# Getting Started

If you have decided to contribute to Forge, you will have to take some special steps to get started with developing. A simple mod development environment will not suffice to work with Forge&rsquo;s codebase directly. Instead, you can use the following guide to help you with your setup and get you started with improving Forge!

## Forking and Cloning the Repository

Like most major open source projects you will find, Forge is hosted on [GitHub](https://www.github.com). If you have contributed to another project before, you will know this process already and can skip right ahead to the next section.

For those who are beginners when it comes to collaboration via Git, here are two easy steps to get you started.


<!-- key:🟠 role:常见错误 -->


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note This guide assumes that you already have a GitHub account set up. If you do not, visit their registration page to create an account. Furthermore, this guide is not a tutorial for git&rsquo;s usage. Please consult different sources first if you are struggling to get it working.

### Forking

First of all, you have to &ldquo;fork&rdquo; the [MinecraftForge repository](https://www.github.com/MinecraftForge/MinecraftForge) by clicking the &ldquo;Fork&rdquo; button in the upper right hand corner. If you are in an organization, select the account you want your fork to be hosted on.

Forking the repository is necessary since not every GitHub user can have free access to every repository. Instead, you create a copy of the original repository to later contribute your changes via a so called Pull Request, which you will learn more about later.

### Cloning

After forking the repository, it is time to get local access to actually make some changes. For this, you need to clone the repository onto your local machine.

Using your favorite git client, simply clone your fork into a directory of your choice. As general example, here is a command line snippet that should work on all correctly configured systems and clones the repository into a directory called &ldquo;MinecraftForge&rdquo; under the current directory (note that you have to replace `<User>` with your username):

`git clone https://github.com/<User>/MinecraftForge`

# Checking out the Correct Branch

Forking and cloning the repository are the only mandatory steps to develop for Forge. However, to ease the process of creating Pull Requests for you, it is best to work with branches.

It is recommended to create and check out a branch for each PR you plan to submit. This way, you can always keep around the latest changes of Forge for new PRs while you still work on older patches.

After completing this step, you are ready to go and set up your development environment.

## Setting Up the Environment

Depending on your favorite IDE, there is a different set of recommended steps you have to follow to successfully set up a development environment.

### Eclipse

Due to the way Eclipse workspaces work, ForgeGradle can do most of the work involved to get you started with a Forge workspace.

1. <li>Open a terminal/command prompt and navigate to the directory of your cloned fork.
2. <li>Type `./gradlew setup` and hit enter. Wait until ForgeGradle is done.
3. <li>Type `./gradlew eclipse` and hit enter. This allows Eclipse to detect the &ldquo;Forge&rdquo; and &ldquo;Clean&rdquo; subdirectories within `projects` to import them into the workspace.
4. <li>Open your Eclipse workspace and go to `File -> Import -> General -> Existing Projects into workspace`.
5. <li>Browse to the `<repo>/projects/` directory for the &ldquo;Root directory&rdquo; option in the dialog that opens.
6. <li>Make sure both &ldquo;Forge&rdquo; and &ldquo;Clean&rdquo; are checked and adjust the other settings to your liking.
7. <li>Complete the import by clicking the &ldquo;Finish&rdquo; button.

That is all it takes to get you up and running with Eclipse. There is no extra steps required to get the test mods running. Simply hit &ldquo;Run&rdquo; like in any other project and select the appropriate run configuration.

### IntelliJ IDEA

JetBrains&rsquo; flagship IDE comes with great integrated support for [Gradle](https://www.gradle.org): Forge&rsquo;s build system of choice. Due to some peculiarities of Minecraft mod development, however, there are additional steps required to get everything to work properly.

#### IDEA 2021 onwards

1. <li>Start IntelliJ IDEA 2021.- <li>If you already have another project open, close the project with the File -> Close project option.
2. <li>In the projects tab of the &ldquo;Welcome to IntelliJ IDEA&rdquo; window, click the &ldquo;Open&rdquo; button on the top right and select the MinecraftForge folder you cloned earlier.
3. <li>Click &ldquo;Trust Project&rdquo; if prompted.
4. <li>After IDEA is done importing the project and indexing its files, run the Gradle setup task. You can do this by:- <li>Open the Gradle sidebar on the right hand side of your screen, then open the forge project tree, select Tasks, then other and double-click the `setup` task (may also appear as `MinecraftForge[Setup]`) found in Forge -> Tasks -> other -> `setup`. - <li>If you get a licensing error during build before making any changes, running the `updateLicenses` task may help. This task is found in Forge -> Tasks -> other as well.

#### IDEA 2019-2020

There are a few minor differences between IDEA 2021 and these versions for setup.

1. <li>Import Forge&rsquo;s `build.gradle` as an IDEA project. For this, simply click `Import Project` from the `Welcome to IntelliJ IDEA` splash screen, then select the `build.gradle` file.
2. <li>After IDEA is done importing the project and indexing the files, run the Gradle setup task. Either:<ol> <li>Open the Gradle sidebar on the right hand side of your screen, then open the `forge` project tree, select `Tasks`, then `other` and double-click the `setup` task (may also appear as `MinecraftForge[Setup]`. Or alternatively:
3. <li>Tap the CTRL key twice, and type `gradle setup` in the `Run` command window that pops up.

You can then run Forge using the `forge_client` gradle task (`Tasks -> fg_runs -> forge_client`): right-click the task and select either `Run` or `Debug` as desired.

#### IDEA older versions

Versions older than 2016 will not work because they did not have the appropriate Gradle support nor support Forge development multi-project workspaces.

IDEA 2016 - 2018 will work with extra manual steps required, but it is strongly recommended to update to IDEA 2019+ instead. cpw has uploaded [a video](https://www.youtube.com/watch?v=yanCpy8p2ZE) for IDEA 2016.1 explaining very similar steps which will lead to a working setup.

That is all there is to creating a Forge development environment in IntelliJ IDEA. However, you will not be able to run tests and debug mods included in Forge straight away. This takes some extra effort.

#### Enabling test mods

To enable the test mods coming with Forge, you will need to add the compiler output to the classpath. Again, cpw has put up [a video](https://www.youtube.com/watch?v=pLWQk6ed56Q) explaining these steps for IDEA 2016.1.

1. <li>Build the test classes by selecting the `src/main/test` directory in your project view and then run `Build -> Build module 'Forge_test'` from the menu bar.
2. <li>Open the &ldquo;Project Structure&rdquo; window under `File -> Project Structure`.
3. <li>Head to the &ldquo;Modules&rdquo; section and expand the `Forge` module.
4. <li>Select the `Forge_test` submodule and head to the &ldquo;Paths&rdquo; tab.
5. <li>Remember the path listed under the &ldquo;Test output path&rdquo; label and select the `Forge_main` submodule from the tree.
6. <li>Open the &ldquo;Dependencies&rdquo; tab, hit the green plus button on the right-hand side, and select &ldquo;JARs or directories&rdquo;.
7. <li>Navigate to the path previously displayed as the `Forge_test` output path and confirm your selection.
8. <li>For the &ldquo;Scope&rdquo; of this newly added dependency (currently &ldquo;Compile&rdquo;) choose &ldquo;Runtime&rdquo;, since the main code does not rely on the test code for compilation.

Now that you have added the test mods to the classpath, you need to rebuild them each time you make a change, as they will not be built automatically. To do so, repeat step 1 from the above list or, in case you make changes to a single test mod file and want them to get rebuilt, simply hit `Build -> Rebuild project` or the corresponding keyboard shortcut (CTRL+F9 by default).

#### Testing with existing mods

You might want to test changes in Forge with an existing project. The [video](https://www.youtube.com/watch?v=pLWQk6ed56Q) by cpw linked in the test mods section also covers this for IDEA 2016.1. Getting the mod to run requires similar steps to the test mod, but getting your project added to the workspace requires some additional work.

1. <li>Open the &ldquo;Project Structure&rdquo; Window under `File -> Project Structure`.
2. <li>Head to the &ldquo;Modules&rdquo; section and press the green plus icon above the tree view.
3. <li>Select &ldquo;Import Module&rdquo;, navigate to your project&rsquo;s `build.gradle` file, and confirm your selection as well as the import settings.
4. <li>Close the &ldquo;Project Structure&rdquo; window by clicking the &ldquo;OK&rdquo; button.
5. <li>Reopen the window after IDEA is done importing the project and select your project&rsquo;s `_main` module from the tree.
6. <li>Open the &ldquo;Dependencies&rdquo; tab, click the green plus icon on the right-hand side, and select &ldquo;Module dependency&rdquo;.
7. <li>In the window that just opened, select the `Forge_main` module.
8. <li>From here on, reproduce the steps from the test mods section, just with your project&rsquo;s `_main` module instead of the `Forge_test` one.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note You might need to remove existing dependencies from a normal development environment (mainly references to a forgeSrc JAR) or move the Forge module higher up in the dependency list.

You should now be able to work with your mod using the changes you introduce to the Forge and Vanilla codebase.

## Making Changes and Pull Requests


<!-- key:🟠 role:常见错误 -->

Once you have set up your development environment, it is time to make some changes to Forge&rsquo;s codebase. There are, however, some pitfalls you have to avoid when editing the project&rsquo;s code.

The most important thing to note is that if you wish to edit Minecraft source code, you must only do so in the &ldquo;Forge&rdquo; sub-project. Any changes in the &ldquo;Clean&rdquo; project will mess with ForgeGradle and generating the patches. This can have disastrous consequences and might render your environment completely useless. If you wish to have a flawless experience, make sure you only edit code in the &ldquo;Forge&rdquo; project!

### Generating Patches

After you have made changes to the code base and tested them thoroughly, you may go ahead and generate patches. This is only necessary if you work on the Minecraft code base (i.e. in the &ldquo;Forge&rdquo; project), but this step is vital for your changes to work elsewhere. Forge works by injecting only changed things into Vanilla Minecraft and hence needs those changes available in an appropriate format. Thankfully, ForgeGradle is capable of generating the changeset for you to commit it.


<!-- key:🟠 role:常见错误 -->

To initiate the patch generation, simply run the `genPatches` Gradle task from your IDE or the command line. After its completion, you can commit all your changes (make sure you do not add any unnecessary files) and submit your Pull Request!

### Pull Requests

The last step before your contribution is added to Forge is a Pull Request (PR in short). This is a formal request to incorporate your fork&rsquo;s changes into the live code base. Creating a PR is easy. Simply go to [this GitHub page](https://github.com/MinecraftForge/MinecraftForge/compare) and follow the proposed steps. It is now that a good setup with branches pays off, since you are able to select precisely the changes you want to submit.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Pull Requests are bound to rules; not every request will blindly be accepted. Follow this document to get further information and to ensure the best quality of your PR! If you want to maximize the chances of your PR getting accepted, follow these PR guidelines!