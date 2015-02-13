### Interactive 3D visualization of structural changes in the brain of a person with corticobasal syndrome

This paper discusses an interactive 3D visualization demonstrating structural
changes within the brain due to a degenerative brain disorder. The application
is approached with two designs in mind, with the first design used a transparent
3D representation of the anatomy and an opaque section. The second design was
based on the Importance-Driven Volume Rendering (IDVR) algorithm, described
elsewhere, creating a view-dependent cutout around a defined Volume of interest
(VOI).

The first implementation takes a relatively standard approach to viewing 3D
medical images, and turn it on its head. The Anatomical volume is rendered with
reduced opacity, which allows for an internal view of anatomical structures but
which can suffer if there is low contrast within those internal representations.
To circumvent this, a flat view dependent plane is positioned inside the volume
structure and a 2D representation of the anatomical image are mapped. This allows
for easily identifiable anatomical white, gray, and other internal structures and
better visual coherence when compared against existing brain atlases. Whats more,
the section of the brain in front of the 2D plane is not removed which makes for
easy localization of anatomical structures.

The author validates the argument that direct Volume Rendering is advantageous to
surface based rendering in that with surface visualizations, one is limited to
data on or near the surface, loosing out on deep internal structures within the
brain. On the other hand, direct volume rendering often yields diffuse borders
while surface renderings can be enhanced with simulated lighting and shadow effects.

The second implementation removes the portion of the volume in front of the clipping
plane altogether. Further, the clipping plane's aperture can be controlled by the
user and the system intuitively updates the clipping field as the brain volume is
moved and allows for a simple interaction on the part of the user while still
maintaining good spatial perception.

I am not convinced yet that stereoscopic visualizations of 3D volume rendered
brain data is actually useful. The author makes several claims that the
stereoscopic visualization improves the perception of depth within the visualization
but does not perform any kind of evaluation to confirm that, merely citing a
study conducted in 2012 which suggests there is evidence for the claim, but admits
more data needs to be collected. As a domain expert myself, I can say with
confidence the **need** for stereoscopic displays of fMRI data have yet to
manifest in any meaningful way within the field. There are certainly outliers to
this fact of course, but by and large, most researchers dont find the use of
Stereoscopic visualizations of brain data all that useful. The reason for this
is a combination or practicality, financial restraints, and technological
limitations, with the emphasis being on practicality. For most researchers, a
stereoscopic visualization is FUN, and does improve their workflow. Very few, if
any research labs have an in house stereoscopic installation, which means they must
travel to a site on campus, assuming their campus offers one at all. Then they
port their data over to the stereoscopic system, which takes time, and often they
arent given unlimited freedom to explore their data at their convenience.
But what about the Occulus-Rift, some might ask, that is a portable device that
at least simulates stereoscopic encoding. The issue in this case would first fall
to money. More accurately, how would they justify it, and why would they spend
$500 on a tool that offers no guarantee towards providing greater insight into
their data when they could spend that money on a scan instead.`

