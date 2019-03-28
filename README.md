# PIXI_FairyGUI

### Description

> [FairyGUI][9] is a Visualization Editor For Game Development.  
> [PixiJS][10] is a render library for create rich, interactive graphic.  
> This library create an interface between both to make development easier.

### Table of Contents

-   [addPackage][1]
    -   [Notice][2]
    -   [Example][3]
    -   [Parameters][4]
-   [create][5]
    -   [Parameters][6]

## addPackage

>  Analysing Fairy Config File and return a factory function.

### Notice

>  Make sure all Resources used by the package were loaded.  
>  This Function use PIXI.Application built-in loader
>  to fetch necessary resources.

### Example

    // Suppose your config filename is package1.fui
    const create = addPackage(app, 'package1');

    // Suppose 'main' is your component name.
    const mainComp = create('main');

    app.stage.addChild(mainComp);

### Parameters

-   `app` **[PIXI.Application][11]** 
-   `packageName` **[string][8]** 

Returns **function ([string][8]): [PIXI.Container][12]** 

## create

> The Function create can take specify component name,  
> which you created by fairyGUI Editor  
> and return the PIXI.Container for that entity.  

### Parameters

-   `resName` **[string][8]** 

Returns **[PIXI.Container][12]** 

[1]: #addpackage

[2]: #notice

[3]: #usage

[4]: #example

[5]: #parameters

[6]: #create

[7]: #parameters-1

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[9]: http://www.fairygui.com/

[10]: http://www.pixijs.com/

[11]: http://pixijs.download/release/docs/PIXI.Application.html

[12]: http://pixijs.download/release/docs/PIXI.Container.html


