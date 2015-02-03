"""
==============================================================================
Program: SynestheticRenderer.py
 Author: Kyle Reese Almryde
   Date:

 Description: This is a text program to examine VTK's capabilities as a Volume
              rendering tool. Additionally, I am exploring what performing
              Volume Rendering on a Book, in this case Mary Shelley's classic
              Frankenstein, will look like.

==============================================================================
"""

from itertools import combinations_with_replacement as comboR
import urllib as url
import random as rd
import numpy as np
import vtk
import os



def loadTextData(corpraName):
    """ Loads the requested text document. First by URL,
        then by local document

    Params:
        arg -- arg

    Returns:

    """
    PATH = "/Users/krbalmryde/Dropbox/Code-Projects/EVL/SynestheticRendering/Resources"
    FRANK = "MaryShelleyFrankenstein.txt"
    SIDD = "SiddharthaHermannHesse.txt"
    FRANKENSTEIN = "http://www.gutenberg.org/cache/epub/84/pg84.txt"
    SIDDHARTHA = "http://www.gutenberg.org/cache/epub/2500/pg2500.txt"

    Library = {'frankenstein': [FRANKENSTEIN, os.path.join(PATH, FRANK)],
               'siddhartha': [SIDDHARTHA, os.path.join(PATH, SIDD)]}
    try:
        fp = url.urlopen(Library[corpraName][0])
        text = fp.read().lower()
        fp.close()
        return text
    except Exception, e:
        raise e
    else:
        with open(Library[corpraName][1], 'rU') as fp:
            return fp.read().lower()


def findBestShape(targetLen, maxRange=80, dims=3):
    """
    Find the most optimal shape for the provided data.

    Returns: tuple consisting of the nDims, plus any remaining
             points
    """
    matches = []
    for x, y, z in comboR(range(maxRange), dims):
        check = (float((x*y*z - targetLen))/targetLen)
        diff = (x*y*z - targetLen)
        if (x*y*z) == targetLen:
            matches.append((x, y, z, diff))
        elif check > 0.0 and check < 0.05:
            matches.append((x, y, z, diff))
    shape = min(matches[:][:])
    print "Shape is", shape, targetLen, float(shape[-1])/targetLen
    return shape


def buildMatrix(data):
    """Contructs a volumetric 3D data matrix consisting of supplied 1D array.

    Using the supplied data, it finds the best fit matrix, reshapes and appends
    any necessary zeros to the matrix in order for the data to fit correctly in
    the data structure

    Params:
        data -- np.array

    Returns:
         The newly formed 3D np.array
    """
    shape = findBestShape(len(data))
    data = np.append(data, np.zeros(shape[-1]))
    data.shape = shape[0:3]
    return data


def histo(data, bins=50, range=None):
    import matplotlib.pyplot as plt
    hist, bins = np.histogram(data, bins=bins, range=range)
    # hist, bins = np.histogram(niiData, bins=100)
    width = 0.9 * (bins[1] - bins[0])
    center = (bins[:-1] + bins[1:]) / 2

    fig, ax = plt.subplots()
    ax.bar(center, hist, align='center', width=width)
    fig.savefig("frankensteinHist.png")

    plt.bar(center, hist, align='center', width=width)
    plt.show()


def generateLUT(data):
    """Generates a random color lookup table

    Params:
        data -- List | set | array which contains a unique list of values

    Returns:
        returns a dictionary containing the value and associated color
    """
    alphaFunc = vtk.vtkPiecewiseFunction()
    colorFunc = vtk.vtkColorTransferFunction()

    lut = dict()
    for k in data:
        if k < 50:
            lut[k] = [0.0, 0.0, 0.0]
        elif k > 500 and k < 1500:
            lut[k] = [rd.random(), rd.random(), rd.random()]
    histo(lut.keys())

    for k, v in lut.items():
        colorFunc.AddRGBPoint(k, v[0], v[1], v[2])
        if k < 500 or k > 1500:
            alphaFunc.AddPoint(k, 0.0)
        else:
            alphaFunc.AddPoint(k, rd.random())

    return alphaFunc, colorFunc


def sumFunc(word):
    total = 0
    for c in word:
        total += ord(c)
    return total


# A simple function to be called when the user decides to quit the application.
def exitCheck(obj, event):
    if obj.GetEventPending() != 0:
        obj.SetAbortRender(1)


# =============================== START OF MAIN ===============================

# Helpful note about numpy indexing
# rdata[:][:][:][:] == rdata[:,:,:,:]
# You must use the form rdata[:,:,:,:]
# for calling this function
# np.mean(rdata[:,:,:,:], dtype=np.float64)  <== increased precision adds
# accuracy


def main():

    text = loadTextData('frankenstein')

    cData = buildMatrix(np.array([ord(c) for c in text]))
    # sData = buildMatrix(np.array(map(sumFunc, text.split())))

    # cData =
    # shape = findBestShape(len(cData))
    # cData = np.append(cData, np.zeros(shape[-1]))
    # cData.shape = shape[0:3]

    histo(cData, 100, (0, 1500))
    # For VTK to be able to use the data, it must be stored as a VTK-image.
    # This can be done by the vtkImageImport-class which imports raw data
    # and stores it.
    dataImporter = vtk.vtkImageImport()

    # Dont need to convert data to string!!
    dataImporter.CopyImportVoidPointer(cData, cData.nbytes)

    # The type of the newly imported data is set to unsigned char (uint8)
    dataImporter.SetDataScalarTypeToUnsignedChar()

    # Because the data that is imported only contains an intensity value
    # (it isnt RGB-coded or someting similar), the importer must be told
    # this is the case.
    dataImporter.SetNumberOfScalarComponents(1)

    dataImporter.SetDataExtent(0, cData.shape[0]-1,
                               0, cData.shape[1]-1,
                               0, cData.shape[2]-1)

    dataImporter.SetWholeExtent(0, cData.shape[0]-1,
                                0, cData.shape[1]-1,
                                0, cData.shape[2]-1)

    alphaFunc, colorFunc = generateLUT(cData.ravel())

    volumeProperty = vtk.vtkVolumeProperty()
    volumeProperty.SetColor(colorFunc)
    volumeProperty.SetScalarOpacity(alphaFunc)
    # volumeProperty.ShadeOn()

    # This class describes how the volume is rendered (through ray tracing)
    compositeFunction = vtk.vtkVolumeRayCastCompositeFunction()

    # We can finally create our volume. We also have to specify the data
    # for it, as well as how the data will be rendered.
    volumeMapper = vtk.vtkVolumeRayCastMapper()
    volumeMapper.SetVolumeRayCastFunction(compositeFunction)
    volumeMapper.SetInputConnection(dataImporter.GetOutputPort())

    # The class vtkVolume is used to pair the previously declared volume
    # as well as the properties to be used when rendering that volume.
    volume = vtk.vtkVolume()
    volume.SetMapper(volumeMapper)
    volume.SetProperty(volumeProperty)

    # With almost everything else ready, its time to initialize the
    # renderer and window, as well as creating a method for exiting the
    # application
    renderer = vtk.vtkRenderer()
    renderWin = vtk.vtkRenderWindow()
    renderWin.AddRenderer(renderer)
    renderInteractor = vtk.vtkRenderWindowInteractor()
    renderInteractor.SetRenderWindow(renderWin)

    # We add the volume to the renderer ...
    renderer.AddVolume(volume)
    # ... set background color to white ...
    renderer.SetBackground(1, 1, 1)
    # ... and set window size.
    renderWin.SetSize(400, 400)

    # Tell the application to use the function as an exit check.
    renderWin.AddObserver("AbortCheckEvent", exitCheck)

    renderInteractor.Initialize()
    # Because nothing will be rendered without any input, we order the
    # first render manually before control is handed over to the main-loop.
    renderWin.Render()
    renderInteractor.Start()


if __name__ == '__main__':
    main()

'''
Mad Ramblings


'''
