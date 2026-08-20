# 4 - Getting the LiteLoader source

> 来源：https://www.liteloader.com/explore/docs/dev:tutorial:source
> 版本：1.12.2
> 页面 ID：dev:tutorial:source
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

[Back to Tutorial Index](.)

# Tutorial Part 4 - Getting the LiteLoader source
Now that you have Eclipse and MCP installed, you can fetch the LiteLoader projects from the SVN repository.

* In Eclipse, click "File" and then "Import..."
* In the SVN category, select "Project from SVN" and click "Next"
* In the Repository Location Information dialog, enter the repository URL and (optionally) name it "LiteLoader"

  * Repository URL: https://subversion.assembla.com/svn/liteloader/ 

* {{:dev:tutorial:svn_repository.png?nolink|}}

* You will be presented with the Select Resource Dialog, click "Browse..." and choose the appropriate resource

 {{:dev:tutorial:select_tag.png?nolink|}}

* For the latest source (usually for the most recent minecraft release but check the commit log to be sure, you can check out the **trunk** from

  * https://subversion.assembla.com/svn/liteloader/LiteLoader/trunk

* If you are using an older version or want to use a particlar version of liteloader you can find release versions under the **tags** node. Simply expand LiteLoader and then tags and select the appropriate tag, eg. for **1.6.4** you could use

  * https://subversion.assembla.com/svn/liteloader/LiteLoader/tags/1.6.4_02

* {{:dev:tutorial:svn_resource.png?nolink|}}

* Click Next and Eclipse will query the repository, once it has done so it will present the Check Out As dialog

 {{:dev:tutorial:svn_checkoutas.png?nolink|}}
         
* Click "Finish" to accept the defaults and import the project.

The LiteLoader project is now imported, and you can add them to your Run Configuration.

# Adding the project to your MCP Run Configuration
Importing the project from the SVN does not actually cause it to run when you run the game inside Eclipse. To include the new projects you must add them to the class path of the Run Configuration for Client.

* In Eclipse, click "Run" and then "Run Configurations..."
* In the "Main Class" box enter the following class name:
  * **com.mumfrey.liteloader.debug.Start**
* Next, click the "Classpath" tab

 {{:dev:tutorial:runconfig.png?nolink|}}

* Click the "User Entries" node in the Classpath tree
* Click the "Add projects" button on the right
* In the Project Selection dialog, check the "LiteLoader" project and **un-check** the "Add required projects of selected projects" option

 {{:dev:tutorial:addprojects.png?nolink|}}

* Click OK and the project and the dependencies will appear in the classpath:

 {{:dev:tutorial:classpath.png?nolink|}}

* Now click "Apply", then "Close" to save the changes
* Your workspace is now ready to add your mod projects.

##### Navigation
* **Next** [Your JDK and Recommended Environment](environment)
* **Previous** [Setting up MCP](mcp)
