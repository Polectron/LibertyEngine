cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        // this.node.active = !cc.sys.isMobile;
    },

    starFollowing: function(rect){
      if (!this.target) {
          return;
      }
      // var follow = cc.follow(this.target, cc.rect(0, 0, 1280, 1280));
      var follow = cc.follow(this.target, rect);
       // var follow = cc.follow(this.target);
      this.node.runAction(follow);
    }
});
