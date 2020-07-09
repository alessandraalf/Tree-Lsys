# Tree-Lsys

Final assignment for CG&3D exam.

We implemented a 3D scene to represent tree structures, based on Lindenmayer system, as described in [this article](http://algorithmicbotany.org/papers/abop/abop-ch1.pdf). 

The project is written in Javascript with [Three.js](https://threejs.org/) framework, based on 
**WEBGL** API. 

![](demo/demo.png)
In this demo you can:
  - Turn day to night with the toggle button
  - Select one of the 11 available presets and modify the preset settings in the form below (axiom, rules, iterations, delta, branch lenght, ...)
  - Build a tree choosing a groud point with mouse click and render with "BUILD TREE" button (if no ground point, default position is (0, 0, 0))
  - Delete the last tree inserted or all trees in the scene respectively with "DELETE LAST TREE" and "DELETE ALL TREES" buttons
  


## Presets
- Common Tree A-F are 2D deterministic L-system tree derivations (based on [this article](http://algorithmicbotany.org/papers/abop/abop-ch1.pdf))
- Tree A-C are 3D stochastic L-system tree derivations (uniform probability) 
- Bush A-B are 3D determistic L-system tree derivations 


## Demo
Check the project running [here](https://alessandraalf.github.io/Tree-Lsys).
