function TreeSettings(parameters) {
  this.preset = parameters.preset || "default";
  this.axiom = parameters.axiom || "F";
  this.rules = parameters.rules || "F=F[+F]F[-F][F]";
  this.iterations = parameters.iterations || 4;
  this.delta = parameters.delta || 25;
  this.branchLength = parameters.branchLength || 3;
  this.branchRadius = parameters.branchRadius || 0.4;
  this.branchReduction = parameters.branchReduction || 0.1;
  this.branchMinRadius = parameters.branchMinRadius || 0.1;
}




