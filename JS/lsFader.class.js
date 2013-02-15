/*
---
description: Fades several child elements of a parent element

license: MIT-style

authors:
- Lars Schweisthal

requires:
- core/1.4.5

provides: [lsFader]

...
*/

var lsFader = new Class({
  Implements: [Options],
  options : {
    'animationDuration' : 800,
    'showDuration' : 2000
  },
  initialize : function(parent, options)
  {
    this.setOptions(options);
    this.parent = document.id(parent);
    this.children = this.parent.getChildren();
    this.activeChild = this.children[0];
    this.setInitialStyles();
    this.startAnimation();
  },
  setInitialStyles : function()
  {
    this.parent.setStyles({
      'overflow' : 'hidden',
      'padding' : 0,
      'position' : 'relative'
    });
    var size = this.parent.getSize();
    this.children.setStyles({
      'height' : size.y + 'px',
      'overflow' : 'hidden',
      'position' : 'absolute',
      'width' : size.x + 'px',
      'z-index' : 0
    });
    this.children.each(
      function(child)
      {
        var animation = new Fx.Tween(child, {
          duration : this.options.animationDuration
        });
        animation.set('opacity', 0);
        child.store('animation', animation);
      }.bind(this)
    );
    this.children[0].setStyle('z-index', 1).retrieve('animation').set('opacity', 1);
  },
  startAnimation : function()
  {
    var nextChild = this.getNextChild();
    nextChild.setStyle('z-index', 2);
    (function()
    {
      nextChild.retrieve('animation').start('opacity', 1).chain(
        function()
        {
          this.activeChild.setStyle('z-index', 0).retrieve('animation').set('opacity', 0);
          nextChild.setStyle('z-index', 1);
          this.activeChild = nextChild;
          this.startAnimation();
        }.bind(this)
      );
    }.bind(this)).delay(this.options.showDuration);
  },
  getNextChild : function()
  {
    var nextChild = this.activeChild.getNext();
    if (nextChild != null)
    {
      return nextChild;
    }
    else
    {
      return this.children[0];
    }
  },
  addParentEvents : function()
  {
    this.parent.addEvents({
      'mouseover' : this.pauseAnimation.bind(this),
      'mouseout' : this.resumeAnimation.bind(this)
    });
  }
});