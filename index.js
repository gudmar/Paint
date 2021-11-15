
// what is the difference between obj.subobj.prop and obj.subobj[prop]
// https://www.sitepoint.com/svg-drawing-basics/


// Now refreshShape can be removed with removeEventListener !!
// const tempRefreshShape = (e) => {
//     this.currentShape.modify(this.p1, getMouseTouchPositionFromSVG.bind(this, e)());
// }
// const refreshShape = tempRefreshShape.bind(this)


// try wrapping html inside pre in <![CDATA[]]> to see if changing < into &lt; is necesarry

class Shape{
    // interface
    constructor(rootSvgElement, elementClass, style, p1, p2){
        // on mouse click
        // p1 = {x1, y1} start point of rectangle containig shape
        // p2 = {x2, y2} end point of Rectangle containing Shape
        // rootSvgElement = svg that will contain all shapes
        // elementClass = class of element to be created: triangle or circle or ..
        // drawingFunction - draw
        // deleteFunction - deleteElement
        // style = {'fill': 'red', 'stroke': 'blue', 'stroke-width': '3'}
        // 

        this.id = Math.random().toString(36).substr(2, 9);
        this.style = style;
        this.p1 = p1;
        this.p2 = p2;
        this.rootSvgElement = rootSvgElement;
        
        this.figure = new elementClass(rootSvgElement, this.id, this.style)
        this.figure.draw(p1, p2)
    }
    modify(p1, p2){
        //on mouse move
        // this can be used to draw a line. Just delete element would do nothing! and draw would modify path !
        this.p1 = p1;
        this.p2 = p2
        this.figure.deleteElement();
        this.figure.draw(p1, p2);
    }
    
    draw(p1, p2){
        this.figure.draw(p1, p2);
    }
    deleteElement(deleteFunction){
        // remove drawn element, in case mouse is moved
        this.figure.deleteElement();
    }
}

class Figure{ // abctract class  - no instance will ever be created
    // This methods cannot be moved to Shape, as this will be not defined. Operations that should be defined figure specific (like calculate points or delete items) would have to be implemented in 
    // Shape. This not only destroys this design patter but also makes code less readable
    constructor(rootSvgElement, id, style){
        this.id = id;
        this.svgElement = rootSvgElement;
        this.parser = new DOMParser();
        this.style = style;
    }
    deleteElement() {
        console.log(this.id)
        console.log(this.svgElement.getElementById(this.id))
        this.svgElement.getElementById(this.id).remove();
    }
    setStyle(element) {
        console.log('SetStyle')
        console.dir(this.style)
        for (let prop in this.style) {
            element.setAttributeNS(null, prop, this.style[prop])
            console.log('%c' + prop + ': ' +this.style[prop], 'background-color: green; color: white')
        }
    }
    calculateFirstoint(p1, p2) {
        //if p1 > p2 then switch cordinanco somehow
        // p1.x < p2.x
        // p1.y < p2.y  
        // If above does not comply, then switch p1 and p2 so that they comply. Cursor does not have to be in p1 or p2 but in p3 or p4 as well
        let pa = {}; let pb={};
        if (p2.x >= p1.x && p2.y >= p1.y) {
            pa = p1; pb = p2; // cursor = p2
        } else if (p2.x < p1.x && p2.y < p1.y) {
            pa = p2; pb = p1; // cursor = p1
        } else if (p2.x >= p1.x && p2.y < p1.y) {
            pa = {x: p1.x, y: p2.y};  pb = {x: p2.x, y: p1.y}; //, cursor = p3
        } else if (p2.x < p1.x && p2.y >= p1.y) {
             pa = {x: p2.x, y: p1.y}; pb = {x: p1.x, y: p2.y}
        }
        return {p1: pa, p2: pb}
    }
}

class Pen extends Figure{
    constructor(rootSvgElement, id, style){
        super(rootSvgElement, id, style);
        this.isStarted = false;
        this.pointList = [];
        this.d = '';
        this.element = null;
    }
    draw(p1, p2){
        // only one p i significant: p2. Will keep both points for compatibility with other classes
        // console.log('%c' + p2.x + '  ' + p2.y, "background-color: yellow;")
        if (this.isStarted) {
            let d = this.element.getAttribute('d') + ` L${p2.x} ${p2.y}`;
            // console.log(d)
            this.element.setAttribute('d', d);
            this.d = d;
        } else {
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            let d = `M${p2.x} ${p2.y}`;
            // console.log(d)
            path.setAttributeNS(null, 'd', d);
            // path.setAttributeNS(null, 'stroke-width', '3');
            // path.setAttributeNS(null, 'fill', this.bgColor);
            // path.setAttributeNS(null, 'stroke', this.bgColor);
            this.setStyle(path);
            path.setAttributeNS(null, 'id', this.id);                
            this.svgElement.appendChild(path);
            this.isStarted = true;
            // this.element = this.svgElement.getElementById(this.id);
            this.element = path;
            // console.log(path)
        }
        // console.log(this.svgElement.getElementById(this.id))
    }
    deleteElement() {

    }
}

class Circle extends Figure{
    constructor(rootSvgElement, id, style){
        super(rootSvgElement, id, style);
    }
    draw(p1, p2){
        let transcormedPoints = this.calculateFirstoint(p1, p2);
        p1 = transcormedPoints.p1;
        p2 = transcormedPoints.p2;
        let cx = (p2.x - p1.x)/2 + p1.x;
        let cy = (p2.y - p1.y)/2 + p1.y;
        // let cx = p2.x;
        // let cy = p2.y;
        let r  = Math.min((p2.y - p1.y)/2, (p2.x - p1.x)/2);
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttributeNS(null, 'cx', cx);
        circle.setAttributeNS(null, 'cy', cy);
        circle.setAttributeNS(null, 'r', r);
        this.setStyle(circle);
        circle.setAttributeNS(null, 'id', this.id);

        console.dir(this.svgElement)

        this.svgElement.appendChild(circle);
    }
}

class Rectangle extends Figure{
    constructor(rootSvgElement, id, style){
        super(rootSvgElement, id, style);
        console.dir(this)
    }
    draw(p1, p2){
        let transcormedPoints = this.calculateFirstoint(p1, p2);
        p1 = transcormedPoints.p1;
        p2 = transcormedPoints.p2;
        let cx = (p2.x - p1.x)/2 + p1.x;
        let cy = (p2.y - p1.y)/2 + p1.y;
        let w = p2.x - p1.x;
        let h = p2.y - p1.y;
        let rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectangle.setAttributeNS(null, 'y', p1.y);
        rectangle.setAttributeNS(null, 'x', p1.x);
        rectangle.setAttributeNS(null, 'height', h);
        rectangle.setAttributeNS(null, 'width', w);
        this.setStyle(rectangle);
        rectangle.setAttributeNS(null, 'id', this.id);

        console.dir(this.svgElement)

        this.svgElement.appendChild(rectangle);
    }
}
class Triangle extends Figure{
    constructor(rootSvgElement, id, style){
        super(rootSvgElement, id, style);
        console.dir(this)
    }
    draw(p1, p2){
        let w = p2.x - p1.x;
        let h = p2.y - p1.y;
        let d = `M${p1.x} ${p1.y+h} L${p1.x+w/2} ${p1.y} L${p2.x} ${p2.y}`
        let triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        triangle.setAttributeNS(null, 'd', d);
        this.setStyle(triangle);
        triangle.setAttributeNS(null, 'id', this.id);

        console.dir(this.svgElement)

        this.svgElement.appendChild(triangle);
    }
}
class Navigator{
    constructor(){
        this.nav = {
                circleButton: document.getElementById('circle'),
                triangleButton: document.getElementById('triangle'),
                rectangleButton: document.getElementById('rectangle'),
                penButton: document.getElementById('pen'),
                redButton: document.getElementById('red'),
                greenButton: document.getElementById('green'),
                blueButton: document.getElementById('blue'),
                yellowButton: document.getElementById('yellow'),
                brownButton: document.getElementById('brown'),
                blackButton: document.getElementById('black'),
                noneButton: document.getElementById('none')
            }
            console.dir(this.nav)
        this.state = {
            style: {'fill': 'red', 'stroke': 'blue', 'stroke-width': '3'},
            shape: 'pen'
        }
        let switchBorderButton = document.getElementById('border-fill-switch');
        this.subscribers = []; // list of objects to inform
        this.isSetFill = true;
        let switchClasses = function(e) {
            if (switchBorderButton.classList.contains("fill")) {
                switchBorderButton.classList.remove('fill');
                switchBorderButton.classList.add('border');
                this.isSetFill = false;
            } else {
                switchBorderButton.classList.remove('border');
                switchBorderButton.classList.add('fill');
                this.isSetFill = true;
            }
        }.bind(this)

        // switchBorderButton.addEventListener('touch', switchClasses)
        switchBorderButton.addEventListener('click', switchClasses)
            // (e) => {
            // if (switchBorderButton.classList.contains("fill")) {
            //     switchBorderButton.classList.remove('fill');
            //     switchBorderButton.classList.add('border');
            //     this.isSetFill = false;
            // } else {
            //     switchBorderButton.classList.remove('border');
            //     switchBorderButton.classList.add('fill');
            //     this.isSetFill = true;
            // }
        // })
    }
    addSubscriber(objectInstance) {
        this.subscribers.push(objectInstance);
        objectInstance.stateChangeHandler(this.state);
    }
    informAllSubscribers(){
        for (let sub of this.subscribers) {
            sub.stateChangeHandler(this.state);
        }
    }
    watchForStateChanges() {
        function unsetAllButtons(type) {
            for (let button in this.nav) {            
                if (type == 'color') {
                    if (this.nav[button].hasAttribute('data-color')) {
                        this.nav[button].classList.remove('active')
                    }
                } else {
                    if (this.nav[button].hasAttribute('data-shape')) {
                        this.nav[button].classList.remove('active')
                    }
                }
            }
        }
        for (let item in this.nav) {
            let button = this.nav[item];
            let clickHandler = function(e) {
                
                if (button.hasAttribute('data-color')) {
                    unsetAllButtons.bind(this, 'color')();
                    button.classList.add('active');
                    if (this.isSetFill){
                        this.state.style['fill'] = button.getAttribute('data-color')
                    } else {
                        this.state.style['stroke'] = button.getAttribute('data-color')
                    }
                } else {
                    unsetAllButtons.bind(this, 'shape')();
                    button.classList.add('active');
                    this.state.shape = button.getAttribute('data-shape')
                }
                this.informAllSubscribers();                
            }
            button.addEventListener('click', clickHandler.bind(this))
        }
    }
}
class Mediator{
    constructor(svgElement = document.getElementById('svgCanvas')){
        this.state = {
            // style: {'fill': 'red', 'stroke': 'blue', 'stroke-width': '3'},
            // shape: 'pen'
        }
        this.svgElement = svgElement;
        this.activateElement = svgElement;
        this.releaseElement = document.querySelector('body');
        this.currentShape = null; // element currntly drawed - instance of shape
        this.p1 = null;
    }
    stateChangeHandler(info){
        this.state.style = info.style==null?this.state.style:info.style;
        this.state.shape = info.shape==null?this.state.shape:info.shape;
        console.group('state changed to: ');
        console.dir(this.state);
        console.groupEnd();
    }
    calculateFirstoint(p1, p2) {
        //if p1 > p2 then switch cordinanco somehow
        // p1.x < p2.x
        // p1.y < p2.y  
        // If above does not comply, then switch p1 and p2 so that they comply. Cursor does not have to be in p1 or p2 but in p3 or p4 as well
        if (p2.x >= p1.x && p2.y >= p1.y) {
            //pa = p1, pb = p2 , cursor = p2
        } else if (p2.x < p1.x && p2.y < p1.y) {
            //pa = p2, pb = p1 , cursor = p1
        } else if (p2.x >= p1.x && p2.y < p1.y) {
            //pa = p1, pb = p4, cursor = p3
        } else if (p2.x < p1.x && p2.y >= p1.y) {
            // pa = p1, pb = p2, cursor = p4
        }
    }
    setDrawingEvents() {
        console.dir(this.activateElement)
        let figure = null;

        function getClientXYFromEvent(e){
            let mouseEvents = ['mousemove', 'mouseup', 'mousedown'];
            let touchEvents = ['touchstart', 'touchend', 'touchmove'];
            let isMouseEvent = mouseEvents.indexOf(e.type)!=-1?true:false;
            let isTouchEvent = touchEvents.indexOf(e.type)!=-1?true:false;
            let x, y;
            if (isMouseEvent) return {x:e.clientX, y: e.clientY}
            if (isTouchEvent) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
            return {x:undefined, y:undefined};
        }

        function getMouseTouchPositionFromSVG(e){
            let svg = this.svgElement;
            let x, y;
            var pt = svg.createSVGPoint();
            pt.x = e.clientX; pt.y = e.clientY;
            ({x, y} = getClientXYFromEvent(e));
            pt.x = x; pt.y = y;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
          }
        const tempRefreshShape = (e) => {
            e.preventDefault();
            this.currentShape.modify(this.p1, getMouseTouchPositionFromSVG.bind(this, e)());
        }
        const refreshShape = tempRefreshShape.bind(this)

        function startDrawing(e) {
            e.preventDefault();
            let p1 = getMouseTouchPositionFromSVG.bind(this, e)()
            let p2 = p1;
            this.p1 = p1;
            switch (this.state.shape) {
                case 'triangle':
                    figure = Triangle;
                    break;
                case 'circle' :
                    figure = Circle;
                    break;
                case 'rectangle': 
                    figure = Rectangle;
                    break;
                case 'pen': 
                    figure = Pen;
                    break;                    
                default:
                    console.error("No shape given")
            }
            console.dir(figure)
            this.currentShape = new Shape(this.svgElement, figure, this.state.style, p1, p2);
            console.log(this.currentShape)
            console.log(this.activateElement)
            this.activateElement.addEventListener('mousemove', refreshShape);
            this.activateElement.addEventListener('touchmove', refreshShape);
            window.addEventListener('mouseup', stopDrawing.bind(this));
            window.addEventListener('touchup', stopDrawing.bind(this));
        }
        function stopDrawing(e) {
            e.preventDefault();
            this.figure = null;
            this.currentShape = null;
            this.p1 = null;
            this.activateElement.removeEventListener('mousemove', refreshShape);
            this.activateElement.removeEventListener('touchmove', refreshShape);
        }

        this.activateElement.addEventListener('mousedown', startDrawing.bind(this));
        this.activateElement.addEventListener('touchdown', startDrawing.bind(this));
        
    }
}




// p1-------------p3
// |              |
// |              |
// |              |
// p4-------------p2