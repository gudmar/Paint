# Paint

This is a simple exercise I made with usage of birdge design pattern. There is na abstract calss, that knows it should draw or resize a shape, but does not know 
implementation details. There are classes like Triangle, Circle, Path or Rectangle, that know how to construct a figure and add color to stroke and fill.

User can draw simple SCG images on screen. Supported shapes:
* Triangle
* Rectangle
* Circle
* Path

Supported colors:
* Green
* Red
* Blue
* Yellow
* Brown
* Red
* Transparent

Color of fill and stroke can be changed. There is a rectangle with wide border icon to switch between selecting a color of fill or stroke.
Clicking image prints whole SVG content to browser console, and can be copied from there after hitting F12 key, and this content can be pasted to a file with .svg extention 
to create a SVG image

## Why important features are missing
There are some features, that would be important for this app usability, like saving to a real file, loading a file, better color chooser, more shapes, ability to 
undo movement or to delete some existing shapes. Although most of this features are very easy to implement, and this script architecture makes it friendly for extentions,
I did not implement them, due to starting different projects and starting learning Angular finally. Perhaps I will go back to this project one day, as I always wanted to 
create a real SVG generator. This sort of application could be used later as a tool to create interesting drawings for a web page. However I am still not sure when this will happen.

## Used technologies
Mainly JS, with a bit of CSS and HTML. Gulp file is provided, so application can be build into a single file.
