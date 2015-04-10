from pyevtk.hl import pointsToVTK
import numpy as np

# Example 1
npoints = 100
x = np.random.rand(npoints)
y = np.random.rand(npoints)
z = np.random.rand(npoints)
pressure = np.random.rand(npoints)
temp = np.random.rand(npoints)
pointsToVTK("./rnd_points", x, y, z, data = {"temp" : temp, "pressure" : pressure})

# Example 2
x = np.arange(1.0,10.0,0.1)
y = np.arange(1.0,10.0,0.1)
z = np.arange(1.0,10.0,0.1)
pointsToVTK("./line_points", x, y, z, data = {"elev" : z})
