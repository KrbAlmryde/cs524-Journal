/*
 Copyright (C) 2012-2013, Stanislaw Adaszewski
 E-mail: s.adaszewski@gmail.com
 Website: http://algoholic.eu
 All Rights Reserved.
 */

define(["jdataview", "sylvester"], function(jDataView, syl) {
    var Nifti = function(buf) {
        var data = new jDataView(buf, 0, buf.length, true);
        data.seek(40);
        var dim = new Array(4);
        dim[0] = data.getInt16();
        if (dim[0] < 1 || dim[0] > 7) {
            data = new jDataView(buf, 0, buf.length, false);
            data.seek(40);
            dim[0] = data.getInt16();
        }
        dim[1] = data.getInt16();
        dim[2] = data.getInt16();
        dim[3] = data.getInt16();
        if (dim[0] != 3) {
            alert('Unsupported dimensionality: ' + dim[0]);
            return;
        }
        data.seek(70);
        var datatype = data.getInt16();
        if (!(datatype in Nifti.datafun)) {
            alert('Unsupported data type: ' + datatype);
            return;
        }
        var datafun = Nifti.datafun[datatype];
        data.seek(108);
        var vox_offset = data.getFloat32();
        var scl_slope = data.getFloat32();
        var scl_inter = data.getFloat32();
        data.seek(280);
        var M = new Array(4);
        for (var i = 0; i < 3; i++) {
            M[i] = new Array(4);
            for (var j = 0; j < 4; j++) {
                M[i][j] = data.getFloat32();
            }
        }
        M[3] = new Array(4);
        M[3][0] = 0; M[3][1] = 0; M[3][2] = 0; M[3][3] = 1;
        M = $M(M);
        var invM = M.inverse().elements;

        var posMin = new Array(4);
        var posMax = new Array(4);
        var size = new Array(4);

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < 2; k++) {
                    v = [i == 0 ? 0 : dim[1], j == 0 ? 0 : dim[2], k == 0 ? 0 : dim[3], 1];
                    var r = M.multiply($V(v));
                    for (var w = 1; w < 4; w++) {
                        if (posMin[w] == undefined || r.e(w) < posMin[w]) {
                            posMin[w] = r.e(w);
                        }
                        if (posMax[w] == undefined || r.e(w) > posMax[w]) {
                            posMax[w] = r.e(w);
                        }
                    }
                }
            }
        }

        for (var i = 1; i < 4; i++) {
            size[i] = posMax[i] - posMin[i];
        }

        var cdata;
        var N = dim[1] * dim[2] * dim[3];
        if (data._isArrayBuffer) {
            cdata = Nifti.arrayfun[datatype](data.buffer, vox_offset);
        } else {
            cdata = new Array(N);
            data.seek(vox_offset);
            for (var i = 0; i < N; i++) {
                cdata[i] = datafun(data);
            }
        }
        var cal_min = Infinity;
        var cal_max = -Infinity;
        for (var i = 0; i < N; i++) {
            var d = cdata[i];
            if (isNaN(d)) {
                continue;
            }
            if (scl_slope != 0) {
                d = scl_slope * d + scl_inter;
            }
            // cdata[i] = d;
            cal_min = Math.min(cal_min, d);
            cal_max = Math.max(cal_max, d);
        }

        this.size = size;
        this.cdata = cdata;
        this.invM = invM;
        this.posMin = posMin;
        this.posMax = posMax;
        this.vox_offset = vox_offset;
        this.dim = dim;
        this.scl_slope = scl_slope;
        this.scl_inter = scl_inter;
        this.cal_min = cal_min;
        this.cal_max = cal_max;
        this.step = (cal_max - cal_min) / 100;
        this.win_min = cal_min;
        this.win_max = cal_max;
    };

    Nifti.DT_UINT8 = 2;
    Nifti.DT_INT16 = 4;
    Nifti.DT_UINT16 = 512;
    Nifti.DT_INT32 = 8;
    Nifti.DT_UINT32 = 768;
    Nifti.DT_FLOAT32 = 16;
// Nifti.DT_COMPLEX64 = 32;
    Nifti.DT_FLOAT64 = 64;
// Nifti.DT_RGB24 = 128;

    Nifti.datafun = {
        2: function(x) { return x.getUint8(); },
        4: function(x) { return x.getInt16(); },
        512: function(x) { return x.getUint16(); },
        8: function(x) { return x.getInt32(); },
        768: function(x) { return x.getUint32(); },
        16: function(x) { return x.getFloat32(); },
        64: function(x) { return x.getFloat64(); }
    };

    Nifti.arrayfun = {
        2: function(buf,ofs) { return new Uint8Array(buf,ofs); },
        4: function(buf,ofs) { return new Int16Array(buf,ofs); },
        512: function(buf,ofs) { return new Uint16Array(buf,ofs) },
        8: function(buf,ofs) { return new Int32Array(buf,ofs); },
        768: function(buf,ofs) { return new Uint32Array(buf,ofs) },
        16: function(buf,ofs) { return new Float32Array(buf,ofs) },
        64: function(buf,ofs) { return new Float64Array(buf,ofs) }
    };

    Nifti.prototype.display = function(canvas, slice) {
        var size = this.size;
        var cdata = this.cdata;
        var invM = this.invM;
        var posMin = this.posMin;
        var posMax = this.posMax;
        var vox_offset = this.vox_offset;
        var dim = this.dim;
        var datafun = this.datafun;
        var scl_slope = this.scl_slope;
        var scl_inter = this.scl_inter;
        var win_min = this.win_min;
        var win_max = this.win_max;

        var win_range = win_max - win_min;

        var w = canvas.width; // >> 1;
        var h = canvas.height; // >> 1;
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, w, h);
        var dataBuf = imageData.data;

        var s0 = slice[0];
        var s1 = slice[1];

        var stepH = size[s0] / h;
        var stepW = size[s1] / w;
        var min1 = posMin[s1];

        if (slice[5] < 0) {
            min1 = posMax[s1];
            stepW *= -1;
        }

        var v = new Array(4);
        v[s0-1] = posMin[s0];
        v[slice[2]-1] = slice[3];
        v[3] = 1;

        if (slice[4] < 0) {
            v[s0-1] = posMax[s0];
            stepH *= -1;
        }

        var imageOfs = 0;
        var vv = [0, 0, 0, 0];
        var ofs;
        var d;

        for (var i = 0; i < h; i++) {
            v[s1-1] = min1;
            for (var j = 0; j < w; j++) {
                vv[0] = invM[0][0] * v[0] + invM[0][1] * v[1] + invM[0][2] * v[2] + invM[0][3] * v[3];
                vv[1] = invM[1][0] * v[0] + invM[1][1] * v[1] + invM[1][2] * v[2] + invM[1][3] * v[3];
                vv[2] = invM[2][0] * v[0] + invM[2][1] * v[1] + invM[2][2] * v[2] + invM[2][3] * v[3];

                vv[0] = Math.min(dim[1]-1,Math.max(0,~~vv[0]));
                vv[1] = Math.min(dim[2]-1,Math.max(0,~~vv[1]));
                vv[2] = Math.min(dim[3]-1,Math.max(0,~~vv[2]));

                ofs = vv[0] + dim[1] * (vv[1] + vv[2] * dim[2]);
                d = cdata[ofs];
                if (scl_slope != 0) {
                    d = scl_slope * d + scl_inter;
                }
                d = 255 * (d - win_min) / win_range;
                dataBuf[imageOfs++] = d;
                dataBuf[imageOfs++] = d;
                dataBuf[imageOfs++] = d;
                dataBuf[imageOfs++] = 255;

                v[s1-1] += stepW;
            }
            v[s0-1] += stepH;
        }

        ctx.putImageData(imageData, 0, 0);
        // ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
    };

    Nifti.prototype.getValue = function (v) {
        var invM = this.invM;
        var dim = this.dim;
        var vv = [0, 0, 0, 0];
        vv[0] = ~~(invM[0][0] * v[0] + invM[0][1] * v[1] + invM[0][2] * v[2] + invM[0][3] * v[3]);
        vv[1] = ~~(invM[1][0] * v[0] + invM[1][1] * v[1] + invM[1][2] * v[2] + invM[1][3] * v[3]);
        vv[2] = ~~(invM[2][0] * v[0] + invM[2][1] * v[1] + invM[2][2] * v[2] + invM[2][3] * v[3]);
        if (vv[0] < 0 || vv[0] >= dim[1]) {
            return NaN;
        }
        if (vv[1] < 0 || vv[1] >= dim[2]) {
            return NaN;
        }
        if (vv[2] < 0 || vv[2] >= dim[3]) {
            return NaN;
        }
        var ofs = (vv[0] * dim[2] + vv[1]) * dim[3] + vv[2];
        var d = this.cdata[ofs];
        return d;
    }

    return Nifti;
});
