Cubeguard
===

Cubeguard is a Sparkl Plugin for Pentaho BA Platform that intends to deliver a dynamic layer of security for Mondrian - olap engine.

With this plugin, the developers can use the ETL tool [PDI] to customize the access levels for each Schema.

Key Advantages

* The developer can take advantage of session variables to customize the resultset or XML;
* The developer doesn't need to change the java code to deliver dynamic processing;
* The developer has more flexibility on the datasource that will customize the access control;

#How to install

Cubeguard is available at Pentaho Marketplace. If you still don't have Marketplace installed in your Pentaho Server, just navigate to http://community.pentaho.com/, find Marketplace there and follow the instructions.

Cubeguard can be installed following the steps:

1. Find the plugin at your Pentaho Marketplace in your User Console;
2. Click install on the plugin page;
3. After installing, you need the server to be restarted for the plugin to be loaded;
4. Once your server is restarted, you need now to open Cubeguard from the menu Tools > Cubeguard
5. There, you will see a dashboard with the "Environment config checklist". the item called "All plugin files installed?" should be marked in yellow saying "Not/Bad Installed: click here to fix" - Click that to install the files;
6. After having the files installed you will have to restart your Server once again, for the classes to be loaded.

#Getting started

When the server is restarted for the second time and the plugin have its classes loaded, you are then able to configure, for each of your Analysis Schemas, the usage of ktr sources for your security layer.

For each of your Schemas, you have the opportunity to configure:

* [Enabled to use dynamic security?] - Whether it's going or not to use the plugin and its dynamic security;
* [Source endpoint] - The endpoint [ktr] that Cubeguard will use to fetch the rules;
* [Endpoint Type] - The type of information that the endpoint will output.

## Enabled to use dynamic security?

This option tells Mondrian if a given Analysis Schema will use our Plugin.

The way Cubeguard works behind the scenes is by implementing a [DynamicSchemaProcessor](http://mondrian.pentaho.com/documentation/schema.php#Schema_processor).

In the traditional implementations of DSP, some developers are given the task to develop a class that implements DSP and builds an xml based on some rules that are often inside of databases. These databases then need to be accessed from the java code and that is where all the work happens.

With cubeguard, we've built a DSP that allows the external world to have more control over the rules. There is no database access from our DSP Class. Instead, we've provided an endpoint [ktr] access. This endpoint can output a dataset - that we've preestablished based on some use cases - or an XML.

## Source endpoint

In this option you can choose among the available endpoints for Cubeguard plugin, which is going to be the endpoint that will output the rules for that specific Schema.

## Endpoint Type

This attribute will tell which kind of information the [Source endpoint] will output.

You have two options here:

#### resultset

This value will tell Cubeguard to try to parse the resultset coming from your endpoint and attempt to build the corresponding XML inside of the class.

This resultet we've defined is based on some usecases and though it's very helpful in most of the cases, still lacks of fine-grain-configuring.

The intend of this definition is to deliver in the next versions, a web interface that could handle this, so the developer didn't have to open Data Integration for configuring the rules.

The **resultset** option still doesn't take control about:
* The order of the rules in the XML;
* The attributes:
   * bottomLevel from HierarchyGrant
   * topLevel from HierarchyGrant
   * rollupPolicy from HierarchyGrant

There are four datasets that can be joined together:

##### Hierarchies/Measures to be denied

In this resultset, for the SteelWheelsSales cube, Cubeguard will deny access to the whole Product Dimension, as well as to the member [NA] from [Markets].

For the Quadrant Analysis cube, from the schema SampleData, it will only deny access to the dimension [Positions].

When we want to deny the access to the whole Hierarchy, we should fill the field `Member` with the value `all`.


| User          | SchemaName    | Cube              | Hierarchy     | Member         |
| ------------- | ------------- | ----------------- | ------------- | -------------- |
| Admin         | SteelWheels   | SteelWheelsSales  | [Product]     | all            |
| Admin         | SteelWheels   | SteelWheelsSales  | [Markets]     | [Markets].[NA] |
| Admin         | SampleData    | Quadrant Analysis | [Positions]   | all            |

> _The fields User, SchemaName and Cube are here for convenience. They will allow easy filtering process._

##### Hierarchies/Measures to be allowed

In this resultset, for the SteelWheelsSales cube, Cubeguard will allow the user Admin to see only the measure Quantity.

For the Quadrant Analysis cube, from the schema SampleData, it will allow access to the whole dimension [Department] - in its default hierarchy.

When we want to allow the access to the whole Hierarchy, we should fill the field `Member` with the value `all`.


| User          | SchemaName    | Cube              | Hierarchy     | Member                  |
| ------------- | ------------- | ----------------- | ------------- | ----------------------- |
| Admin         | SteelWheels   | SteelWheelsSales  | [Measures]    | [Measures].[Quantity]   |
| Admin         | SampleData    | Quadrant Analysis | [Department]  | all                     |

> _The fields User, SchemaName and Cube are here for convenience. They will allow easy filtering process._

##### cubes to be denied

Here, the user named pat will not see the cube Sales from FoodMart Schema.


| User          | SchemaName    | Cube              | Hierarchy     | Member                  |
| ------------- | ------------- | ----------------- | ------------- | ----------------------- |
| pat         | FoodMart   | Sales  | -    | -   |

> _The fields User, SchemaName and Cube are here for convenience. They will allow easy filtering process._


##### SchemaGrantAll

Here, the user named pat will have full access to the schema FoodMart, even if there are other rules in the stream.


| User          | SchemaName    | Cube              | Hierarchy     | Member                  |
| ------------- | ------------- | ----------------- | ------------- | ----------------------- |
| pat         | FoodMart   | -  | -    | -   |

> _The fields User, SchemaName and Cube are here for convenience. They will allow easy filtering process._


#### xml

When the "Type of endpoint output" is set to xml, Cubeguard will get the value of the very first field and first row of the endpoint stream and inject it into the XML where it's supposed to be the <Role>(s) Tag(s).

So if you want to build your XML with your own rules, all you need to do is to create an endpoint that outputs it into a field in the stream.

# More configurations

You are still able to configure a variable name that will be replaced by the username that is logged in.

Accessing `cubeguard.properties` into the plugin folder, you'll see the options:
```
cubeguard.replaceString=true
cubeguard.stringToBeReplaced=${USER_NAME}
```

This tells Cubeguard that whenever the schema is processed, it should replace the string "${USER_NAME}" by the current username on the platform. This replacaement considers the whole schema XML text and it's done before the injection of the endpoint output.
