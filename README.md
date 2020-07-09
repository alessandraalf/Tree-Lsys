# Tree-Lsys

Final assignment for CG&3D exam.

We implemented a 3D scene to represent trees based on Lindenmayer system, as described in [this article](http://algorithmicbotany.org/papers/abop/abop-ch1.pdf). 

The project is written in Javascript with [Three.js](https://threejs.org/)framework, based on 
*WEBGL* API. 

![](demo/demo.png)
In the demo you can:
  - Turn day to night with the toggle button
  - Select a tree preset from 11 options in select tag and modify the selected one in the form below
  - Build a tree choosing a groud point with mouse click and render with "BUILD TREE" button (if no ground point, default position is (0, 0, 0))
  - Delete the last the tree inserted or all trees in scene respectively with "DELETE LAST TREE" and "DELETE ALL TREES"
  


## Presets
- Common Tree A-F are 2D deterministic L-system tree derivations (based on [this article](http://algorithmicbotany.org/papers/abop/abop-ch1.pdf))
- Tree A-C are 3D stochastic L-system tree derivation (uniform probability) 
- Bush A-B are 3D determistic L-system tree derivation 


## Demo
Check the project running [here](https://alessandraalf.github.io/Tree-Lsys).
