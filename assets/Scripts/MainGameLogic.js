cc.Class({
    extends: cc.Component,

    properties: {
      speed: {
        default: 0
      },
      player: cc.Node,
      map_root: cc.Node,
      menu: cc.Node,
      _tiledMap: null,
      _finishedLoading: null,
      _builtCollsions: null,
    },

    save: function(){
      console.log("Save Game");
      var player = this.globalvalues.get("Player");
      player["position"] = cc.v2(this.player.getPosition().x, this.player.getPosition().y);
      console.log(this.globalvalues._values);
      cc.sys.localStorage.setItem("save", JSON.stringify(this.globalvalues._values));
      console.log(cc.sys.localStorage.getItem("save"));
    },

    spawnToMap(url, spawn){
      this.loadTileMap(url, spawn);
    },

    _getGlobalValuesID: function(){
      for (var id in cc.game._persistRootNodes) {
        if(cc.game._persistRootNodes[id]._name == "GlobalValues"){
          return id;
        }
      }
    },

    _getTilePos: function(tiledmap, posInPixel) {
        var tileSize = tiledmap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width)*tileSize.width;
        var y = Math.floor(posInPixel.y / tileSize.height)*tileSize.height;

        return cc.v2(x, y);
    },

    loadTileMap (url, spawn) {
      cc.loader.loadRes(url, cc.TiledMapAsset, (err, tmxAsset) => {
        if (err) {
          cc.error(err);
          return;
        }
        this.createTileMap(tmxAsset, spawn);
      });
    },

    createTileMap (tmxAsset, spawn) {
      this.map_root.destroyAllChildren();
      var node = new cc.Node();
      this.map_root.addChild(node,1,"tiledmap");
      var tileMap = node.addComponent(cc.TiledMap);
      tileMap.tmxAsset = tmxAsset;
      // tmxAsset.pene = "pene";
      this._tiledMap = tileMap;
      this._finishedLoading = true;

      var mapSize = cc.size(this._tiledMap.getMapSize().width*this._tiledMap.getTileSize().width, this._tiledMap.getMapSize().height*this._tiledMap.getTileSize().height);
      this.node.getParent().getChildByName("Root").getComponent("GameFollow").starFollowing(cc.rect(0, 0, mapSize.width, mapSize.height));

      var map = this.globalvalues.get("Map");
      map['size'] = mapSize;
      if(spawn){
        var objectGroup = this._tiledMap.getObjectGroup("events");
        var startObj = objectGroup.getObject("SpawnPoint");
        this.player.setPosition(this._getTilePos(this._tiledMap, cc.v2(startObj.x, startObj.y)));
      }else{
        var player = this.globalvalues.get("Player");
        console.log(player);
        this.player.setPosition(player.position);
      }

    },

    onLoad () {
      this._finishedLoading = false;
      this._builtCollsions = false;

      var globid = this._getGlobalValuesID();
      if (globid){
        this.globalvalues = cc.game._persistRootNodes[globid].getComponent('GlobalValues');
      }

      console.log(this.globalvalues);

      var spawn;
      var game = this.globalvalues.get("Game");
      if(game["isNewGame"] == true){
        spawn = true;
      }else{
        spawn = false;
      }

      game["isNewGame"] = false;

      this.spawnToMap("Maps/"+this.globalvalues.get("Map")['name'], spawn);

      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyPressed, this);

      this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_DOWN, this._onMouseDown, this);
      this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_UP, this._onMouseUp, this);
      this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_MOVE, this._onMouseMove, this);
      this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this);

      // UI handling
      this.menu.active = false;

    },

    onCollisionEnter: function (other, self) {
      console.log("on collision enter");
    },

    onCollisionStay: function (other, self) {
      console.log('on collision stay');
    },

    onCollisionExit: function(other, self){
      console.log("left collision area");
      // this._player_moving = true;
    },

    _onKeyPressed: function(event) {
      if(event.keyCode == 27){
        this.menu.getComponent("MenuUIHandler").toggleMenu();
      }
    },

    start () {

    },

    update (dt) {
      if (!this._finishedLoading){
        return;
      }

      if (!this._builtCollsions){
        this._buildCollisions();
      }
      // console.log(this.globalvalues.get("Map"));
    },

    _onMouseDown: function(event){

    },

    _onMouseUp: function(event){

    },

    _onMouseMove: function(event){

    },

    _onMouseLeave: function(event){

    },

    _buildCollisions: function(){
      this._builtCollsions = true;

      // this._tiledMap.node.sortAllChildren();
      // this.player.parent = null;
      // this.player.setPosition(new cc.v2(0,0));
      // this._tiledMap.node.addChild(this.player);

      this._tiledMap.node.setAnchorPoint(cc.v2(0,0));
      // this.map_root.getChildByName(node,1,"tiledmap")

      var top = [];

      for(i = 0; i<this._tiledMap.node.children.length; i++){
        this._tiledMap.node.children[i].setAnchorPoint(cc.v2(0, 0));
        if (this._tiledMap.node.children[i].name == "top"){
          top.push(this._tiledMap.node.children[i]);
        }
      }

      for(i = 0; i<top.length; i++){
        top[i].parent = null;
        this.node.getParent().getChildByName("Root").addChild(top[i]);
        // top[i]._localZOrder= 99;
      }

      this.node.getParent().getChildByName("Root").sortAllChildren();
      //rectangle: 0
      //ellipse: 1 -> ignore
      //polygon: 2

      var objects = this._tiledMap.getObjectGroup('collisions').getObjects();
      var destination = this.node.getParent().getChildByName("Root").getChildByName("Map_Root");
      // console.log(destination);
      for(i = 0; i<objects.length; i++){
        if (objects[i].type == 0){
          var box = destination.addComponent(cc.BoxCollider);
          // box._offset = new cc.v2(objects[i].offset.x, (objects[i].offset.y-cc.winSize.height/2)*(-1));
          box._offset = new cc.v2(objects[i].offset.x+objects[i].width/2, (objects[i].offset.y-cc.winSize.height*2+objects[i].height/2)*(-1));
          box._size = new cc.size(objects[i].width, objects[i].height);
        }

        if (objects[i].type == 2){
          var poly = destination.addComponent(cc.PolygonCollider);
          poly._offset = new cc.v2(objects[i].offset.x, (objects[i].offset.y-cc.winSize.height*2)*(-1));
          // poly.points = objects[i].points;
          poly.points = [];
          for(var j = 0; j<objects[i].points.length; j++){
            poly.points.push(new cc.v2(objects[i].points[j].x, objects[i].points[j].y*-1));
          }
        }
      }
    },

    _isInRadius(x, y, x_center, y_center, radius){
      return (Math.pow((x - x_center),2) + Math.pow((y - y_center),2) ) > Math.pow(radius, 2);
    }

});
