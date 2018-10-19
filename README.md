# wbp-cssunitconverter
Plugin for Blumentals WeBuilder/RapidPHP/RapidCSS/HTMLPad editors

This is a plugin for the following editors:

Webuilder: http://www.webuilderapp.com/<br/>
RapidPHP: http://www.rapidphpeditor.com/<br/>
RapidCSS: https://www.rapidcsseditor.com/<br/>
HTMLPad: https://www.htmlpad.net/


#### Function:

Convert stylesheet units from one format to another.

Can convert a pixel based stylesheet into em, rem, vmax, vmin etc, or the other way around.</br>
Can also be used to scale the current units.

![GUI](http://i.imgur.com/1JP5nuh.png "GUI")

#### Usage:

1) Select a block of CSS code.
2) Activate the plugin from the "Plugins" menu or press the hotkey CTRL-ALT-U
3) Fill in the values for your conversion and click the "OK" Button.

#### How it works:

It finds the selected CSS unit and divides the number with the "Base Size" using formula: NewSize = UnitSize/BaseSize.
(If "Invert base size" is checked, then the formula is: NewSize = UnitSize*BaseSize.)


#### Installation:
1) Download plugin .ZIP file.
2) Open editor and select "Plugins -> Manage Plugins" from the menu.
3) Click "Install" and select the .ZIP file you downloaded in step 1.
