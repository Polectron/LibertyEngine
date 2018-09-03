// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      _values: {
        default: {}
      },
      // _hero: {
      //   default: {}
      // },
      // _map: {
      //   default: {}
      // }
    },

    set: function(name, value){
      this._values[name] = value;
    },

    get: function(name){
      return this._values[name];
    },

    remove: function(name){
      var temp = JSON.parse(JSON.stringify(this._values[name]));
      delete this._values[name];
      return temp;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    //
    // },

    // start () {
    //
    // },

    // update (dt) {},
});
