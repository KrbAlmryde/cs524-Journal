import pyevtk.vtk as evtk
import numpy as np
import cPickle

# **************************************************************
# * Example of how to use the low level VtkFile class.         *
# **************************************************************


class TextData(object):
    """Simple class to hold dynamic attributes and values"""
    def __init__(self, **kwds):
        super(TextData, self).__init__()
        self.__dict__.update(kwds)

    def __call__(self, **kwds):
        self.__dict__.update(kwds)


def serialize(fname, data):
    with open(fname) as f:
        cPickle.dump(data, f, cPickle.HIGHEST_PROTOCOL)


def toScalar(word):
    body = word.split('#')[0]
    scalar = sum([ord(w) for w in body])
    return scalar


def buildWordNet(fpoint):
    wordNet = TextData(
        word=np.array([]),  velocity=np.array([]),
        positive=np.array([]), objective=np.array([]),
        negative=np.array([]),  scalar=np.array([]),
        intensity=np.array([]))
    for line in fpoint.readlines():
        if line.startswith("#"):
            pass
        else:
            pos, neg, wrd = line.split("\t")[2:5]
            print pos, neg, wrd
            pos, neg = float(pos), float(neg)
            obj = 1.0 - (float(pos) + float(neg))
            vector = (pos, obj, neg)
            wordNet.word = np.append(wordNet.word, wrd)
            wordNet.velocity = np.append(wordNet.velocity, vector)
            wordNet.positive = np.append(wordNet.positive, pos)
            wordNet.negative = np.append(wordNet.negative, neg)
            wordNet.objective = np.append(wordNet.objective, obj)
            wordNet.scalar = np.append(wordNet.scalar, toScalar(wrd))
    scalars = wordNet.scalar
    wordNet.velocity.shape = (scalars.shape[0], 3)  # convert it to (N,3)
    wordNet.intensity = (scalars/scalars.max()) * 255.

    return wordNet


def loadData(infile, serialized=True):
    """
    Load a coprus text file OR an existing serialized
    object.
    """
    wordNet = None
    with open(infile) as f:
        if serialized:
            wordNet = cPickle.load(f)
        else:
            wordNet = buildWordNet(f)
    return wordNet


def padData(data, before, after):
    data.intensity= np.pad(data.intensity, ((0, after-before)), 'constant', constant_values=0 )
    data.negative = np.pad(data.negative, ((0, after-before)), 'constant', constant_values=0 )
    data.objective = np.pad(data.objective, ((0, after-before)), 'constant', constant_values=0 )
    data.positive = np.pad(data.positive, ((0, after-before)), 'constant', constant_values=0 )
    data.scalar = np.pad(data.scalar, ((0, after-before)), 'constant', constant_values=0 )
    data.velocity = np.pad(data.velocity, ((0, after-before)), 'constant', constant_values=0 )
    data.word = np.pad(data.word, ((0, after-before)), 'constant', constant_values=0 )
    return data


# ******************************************************************************
#                                START OF MAIN
# ******************************************************************************

def main():

    nx, ny, nz = [49]*3
    lx, ly, lz = 1.0, 1.0, 1.0
    dx, dy, dz = lx/nx, ly/ny, lz/nz
    # ncells = nx * ny * nz
    # npoints = (nx + 1) * (ny + 1) * (nz + 1)
    x = np.arange(0, lx + 0.1*dx, dx, dtype='float64')
    y = np.arange(0, ly + 0.1*dy, dy, dtype='float64')
    z = np.arange(0, lz + 0.1*dz, dz, dtype='float64')
    start, end = (0, 0, 0), (nx, ny, nz)

    # corpus = "data/SentiWordNet_3.0.0_20130122.txt"
    serial = "data/SentiWordNet.data"
    data = loadData(serial, serialize=True)

    w = evtk.VtkFile("data/SentiWordNet", evtk.VtkRectilinearGrid)
    w.openGrid(start=start, end=end)
    w.openPiece(start=start, end=end)

    data = padData(data, 117659, 50**3)

    # Point data
    data.velocity = (data.positive, data.objective, data.negative)
    w.openData("Point", scalars="Eigen", vectors="Velocity")
    w.addData("Eigen", data.scalar)
    w.addData("Velocity", data.velocity)
    w.closeData("Point")

    # Cell data
    w.openData("Cell", scalars="Intensity")
    w.addData("Intensity", data.intensity)
    w.closeData("Cell")

    # Coordinates of cell vertices
    w.openElement("Coordinates")
    w.addData("x_coordinates", x)
    w.addData("y_coordinates", y)
    w.addData("z_coordinates", z)
    w.closeElement("Coordinates")

    w.closePiece()
    w.closeGrid()

    print data.scalar, data.velocity, data.intensity

    w.appendData(data=data.scalar)
    w.appendData(data=data.velocity)
    w.appendData(data=data.intensity)
    w.appendData(x).appendData(y).appendData(z)
    w.save()

    serialize("data/SentiWordNet.data", data)

if __name__ == '__main__':
    main()



