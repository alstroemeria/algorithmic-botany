define([], function () {
  function parse(rule) {
    var axiom = rule.axiom;
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
  }
  return parse;
});
