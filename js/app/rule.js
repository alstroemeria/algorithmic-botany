define([], function () {
  return {
  	 tree: {
      'axiom': 'A',
      'angle': 22.5,
      'depth': 6,
      'set': {
        'A':'[&FL!!A]/////’[&FL!!A]///////~[&FL!!A]',
        'F':'S/////F',
        'S':'FL',
        'L':'[~~~^^{-f+f+f-|-f+f+f}]'
      }
    },
    load: function () {
      this.rule.axiom = this.tree.axiom;
      this.rule.depth = this.tree.depth;
      this.rule.angle = this.tree.angle;
      this.rule.set = this.tree.set;
    },
    parse: function() {
      var axiom = this.rule.axiom;
      var piece = '';
      var builder = "";

      for (var i = 0; i< rule.depth; i++ ){
        builder = "";
        for (var j = 0; j< axiom.length; j++ ){
          piece = axiom[j];
          if (rule.set.hasOwnProperty(piece)){
            piece = rule.set[piece];
          }
          builder += piece;
        }
        axiom = builder;
      }
      console.log(axiom);
      return axiom;
    },
  }
});
