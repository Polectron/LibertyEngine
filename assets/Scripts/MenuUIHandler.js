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
      _menu_on_focus: null
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    _getGlobalValuesID: function(){
      for (var id in cc.game._persistRootNodes) {
        if(cc.game._persistRootNodes[id]._name == "GlobalValues"){
          return id;
        }
      }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      this._menu_on_focus = false;
      this.globalvalues = cc.game._persistRootNodes[this._getGlobalValuesID()].getComponent('GlobalValues');
    },

    // update (dt) {},

    openItems(){

    },

    openTeam(){

    },

    saveGame(){
      this.node.getParent().getChildByName("Main Logic").getComponent("MainGameLogic").save();
    },

    openMenu(){
      this.node.active = true;
      this._menu_on_focus = true;
    },

    closeMenu(){
      this.node.active = false;
      this._menu_on_focus = false;
    },

    toggleMenu(){
        this.node.active = !this.node.active;
        this._menu_on_focus = !this._menu_on_focus;
    },

    openOpciones(){
      this._menu_on_focus = false;
      this.node.getParent().getChildByName("Options").active = true;
    }
});
