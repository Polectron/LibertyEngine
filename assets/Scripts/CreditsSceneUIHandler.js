cc.Class({
    extends: cc.Component,
    btnTouchExit: function(){
      this.close();
    },
    properties: {
      btnExit:{
        default:null,
        type:cc.Button
      }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    // update (dt) {},

    close: function(){
      cc.director.loadScene('LoadScene');
    }
});
