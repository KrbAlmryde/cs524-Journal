"""
==============================================================================
Program: buildWordNet.py
 Author: Kyle Reese Almryde
   Date: 03/26/2015

 Description: This script should only have to run once (ideally). It extracts
              the



==============================================================================
"""

import re
import cPickle


def buildWordNet(fpoint):
    wordNet = {}
    for line in fpoint.readlines():
        if line.startswith("#"):
            pass
        else:
            pos, neg, wrdRAW = line.split("\t")[2:5]
            print pos, neg, wrdRAW
            pos, neg = float(pos), float(neg)
            obj = 1.0 - (float(pos) + float(neg))
            vector = (pos, obj, neg)
            wrdsCL = [w.strip() for w in re.split("#[0-9][0-9]?", wrdRAW)[:-1]]
            for w in wrdsCL:
                wordNet[w] = vector

    return wordNet


# =============================== START OF MAIN ===============================

def main():
    corpus = "data/SentiWordNet_3.0.0_20130122.txt"
    with open(corpus, 'r') as f:
        data = buildWordNet(f)

    with open('SentiWordNet.dict', 'w') as w:
        cPickle.dump(data, w, cPickle.HIGHEST_PROTOCOL)

if __name__ == '__main__':
    main()
