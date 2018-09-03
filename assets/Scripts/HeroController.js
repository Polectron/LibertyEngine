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
      speed: {
        default: 1
      },
      _moving_player_mouse: null,
      _player_moving:null,
      _current_mouse_pos: null,
      _old_player_pos: null,
      _moving_w_mouse: null,
      _player_directions: {
        default: null
      },
    },


    _getPlayerPos(){
      return this.node.getPosition();
    },

    _onKeyPressed: function(event) {
      if(event.keyCode == cc.macro.KEY.up){
        this._player_directions.y = 1;
        this._player_moving = true;
      }

      if(event.keyCode == cc.macro.KEY.down){
        this._player_directions.y = -1;
        this._player_moving = true;
      }

      if(event.keyCode == cc.macro.KEY.left){
        this._player_directions.x = -1;
        this._player_moving = true;
      }

      if(event.keyCode == cc.macro.KEY.right){
        this._player_directions.x = 1;
        this._player_moving = true;
      }
    },

    _onKeyReleased: function(event) {
      if(event.keyCode == cc.macro.KEY.up && this._player_directions.y == 1){
        this._player_directions.y = 0;
      }

      if(event.keyCode == cc.macro.KEY.down && this._player_directions.y == -1){
        this._player_directions.y = 0;
      }

      if(event.keyCode == cc.macro.KEY.left && this._player_directions.x == -1){
        this._player_directions.x = 0;
      }

      if(event.keyCode == cc.macro.KEY.right && this._player_directions.x == 1){
        this._player_directions.x = 0;
      }
    },

    onCollisionEnter: function (other, self) {
      // cc.loader.loadRes("Sounds/Player bump", cc.AudioClip, function (err, clip) {
      //   var audioID = cc.audioEngine.play(clip, false, 0.5);
      // });
      // this.node.setPosition(this.node.getPosition().addSelf(this._player_directions.mul(this.speed*-2)));

      cc.loader.loadRes("Sounds/Player bump", cc.AudioClip, function (err, clip) {
        var audioID = cc.audioEngine.play(clip, false, 0.5);
      });
      this.node.setPosition(this.node.getPosition().addSelf(this._player_directions.mul(this.speed*-1)));
      this._delay_after_collision = 0.2;

      // this._player_directions = new cc.v2(0,0);
      // this.node.color = cc.Color.RED;

      this.touchingNumber ++;

      // 1st step
      // get pre aabb, go back before collision
      var otherAabb = other.world.aabb;
      var otherPreAabb = other.world.preAabb.clone();

      var selfAabb = self.world.aabb;
      var selfPreAabb = self.world.preAabb.clone();

      // 2nd step
      // forward x-axis, check whether collision on x-axis
      selfPreAabb.x = selfAabb.x;
      otherPreAabb.x = otherAabb.x;

      if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
          if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
              this.node.x = otherPreAabb.xMax - this.node.parent.x;
              this.collisionX = -1;
          }
          else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
              this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
              this.collisionX = 1;
          }

          this._player_directions.x = 0;
          other.touchingX = true;
          // this.collisionX = 1;
          return;
      }

      // 3rd step
      // forward y-axis, check whether collision on y-axis
      selfPreAabb.y = selfAabb.y;
      otherPreAabb.y = otherAabb.y;

      if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
          if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
              this.node.y = otherPreAabb.yMax - this.node.parent.y;
              this.collisionY = -1;
          }
          else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
              this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
              this.collisionY = 1;
          }

          this._player_directions.y = 0;
          // this.collisionY = 1
          other.touchingY = true;
      }
    },

    onCollisionExit: function (other) {
        this.touchingNumber --;
        if (this.touchingNumber === 0) {
            // this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
        }
    },

    _onMouseDown: function(event){
      this._moving_player_mouse = true;
      this._player_moving = true;
      this._moving_player_mouse = true;
    },

    _onMouseUp: function(event){
      this._moving_player_mouse = false
      this._player_moving = false;
      this._player_directions = new cc.v2(0,0);
      this._moving_player_mouse = false;
    },

    _onMouseMove: function(event){
      this._current_mouse_pos = event.getLocation();
      if (this._moving_player_mouse){
        this._player_directions = this._getPlayerPos().sub(this._current_mouse_pos).normalize().mul(-1);
      }
    },

    _onMouseLeave: function(event){
      this._moving_player_mouse = false
      this._player_moving = false;
      this._player_directions = new cc.v2(0,0);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      // Input handling
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyReleased, this);
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyPressed, this);
      // this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_DOWN, this._onMouseDown, this);
      // this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_UP, this._onMouseUp, this);
      // this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_MOVE, this._onMouseMove, this);
      // this.node.getParent().getChildByName("Canvas").on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this);

      // Movement handling
      this._player_directions = cc.v2(0, 0);
      this._player_moving = false;
      this._current_mouse_pos = this._getPlayerPos();
      this._old_player_pos = this._getPlayerPos();
      this._moving_player_mouse = false;

      var manager = cc.director.getCollisionManager();
      manager.enabled = true;
      manager.enabledDebugDraw = true;
      manager.enabledDrawBoundingBox = true;

      this.touchingNumber = 0;
      this.collisionY = 0;
      this.collisionX = 0;
      this._delay_after_collision = 0;
    },

    start () {

    },

    update (dt) {
      // console.log(dt);
      if (this._delay_after_collision > 0){
        this._delay_after_collision -= dt;
        if(this._delay_after_collision < 0){
          this._delay_after_collision = 0;
        }
      }
      if (!this._moving_player_mouse || !this._isInRadius(this._current_mouse_pos.x, this._current_mouse_pos.y, this._getPlayerPos().x, this._getPlayerPos().y, 32)){
          if (this._delay_after_collision <= 0){

            this._old_player_pos = this._getPlayerPos;

            if (this.collisionY != 0) {
              this._player_directions.y = 0;
              // console.log(this.collisionY);
            }
            if (this.collisionX != 0) {
              this._player_directions.x = 0;
              // console.log(this.collisionX);
            }

            this.node.setPosition(this._getPlayerPos().addSelf(this._player_directions.mul(this.speed)));
          }
      }else{
        // this._moving_player_mouse = false
        // this._player_moving = false;
        this._player_directions = new cc.v2(0,0);
      }
    },
});
