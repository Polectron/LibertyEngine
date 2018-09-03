
cc.Class({
  extends: cc.Component,

  properties: {
    label: {
      default: null,
        type: cc.Label
    },
    btnLoad: {
      default: null,
      type: cc.Button
    },
    btnNew: {
      default: null,
      type: cc.Button
    },
    btnCredits: {
      default: null,
      type: cc.Button
    },
    mapName: '',
    title: ''
  },

  _showSaves: function(saves){

  },

  touchBtnLoad: function(){
    console.log("Cargar partida");
    var save = cc.sys.localStorage.getItem("save");
    // this._showSaves(save);
    this.globalvalues._values = JSON.parse(save);
    JSON.stringify(this.globalvalues._values);
    cc.director.loadScene('GameScene');
  },
  touchBtnNew: function(){
    console.log("Nueva partida");
    this.globalvalues.set("Map", {name:this.mapName});
    this.globalvalues.set("Game", {isNewGame: true})
    this.globalvalues.set("Player", {name: "Red", items: {}})
    cc.director.loadScene('GameScene');
    // cc.sys.localStorage.setItem("inventory", "contenido del inventorio");
  },
  touchBtnCredits: function(){
    cc.director.loadScene('CreditsScene');
  },
  touchBtnOptions: function(){
    this.node.getParent().getChildByName("Options").active = true;
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  onLoad: function () {
    this.label.string = this.title;

    this.globalvalues = this.node.getParent().getChildByName('GlobalValues').getComponent('GlobalValues');

    if (cc.sys.localStorage.getItem("options") === null){
      cc.sys.localStorage.setItem("options", {})
    }

    cc.game.addPersistRootNode(this.node.getParent().getChildByName('GlobalValues'));
  },

  start () {
    if(cc.sys.localStorage.getItem("save") !== null){
      this.btnLoad.interactable = true;
      // this.btnLoad.normalColor = new cc.Color(185, 155, 55);
    }
  },

    // update (dt) {},
});
