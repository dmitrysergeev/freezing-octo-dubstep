#coding: utf-8
import tornado.ioloop
import tornado.options
import tornado.web
import os.path
import urllib
import urllib2
from tornado.options import define, options
from tornado.escape  import json_encode, json_decode
from itertools import takewhile, dropwhile, chain
from numpy import *
define("port", default=10030, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [(r"/", MainHandler)]
        settings = dict(
            static_path = os.path.join(os.path.dirname(__file__).decode('utf-8'), "static"),
            autoescape = None
        )
        tornado.web.Application.__init__(self, handlers, **settings)

Mx = matrix('-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1')
Pz = matrix('1 0 0 0; 0 1 0 0; 0 0 0 0; 0 0 0 1')
T = matrix('1 0 0 0; 0 1 0 0; 0 0 0 0; 200 200 0 1')

class MainHandler(tornado.web.RequestHandler):
    def get(self):       
        self.render("index.html")        
    def post(self):
        Tx = float(self.get_argument("Tx"))
        Ty = float(self.get_argument("Ty"))
        Tz = float(self.get_argument("Tz"))
        Cx = float(self.get_argument("Cx"))
        Cy = float(self.get_argument("Cy"))
        Cz = float(self.get_argument("Cz"))
        P = str(self.get_argument("P"))
        alpha = sqrt(Cx * Cx + Cy * Cy + Cz * Cz)
        Uz = matrix([[1,0,0,0], [0,1,0,0], [0,0,0,-1.0/alpha], [0,0,0,1]])
        sinX = 0 if (Cx == Cy == Cz == 0) else sqrt(Cx * Cx + Cy * Cy) / sqrt(Cx * Cx + Cy * Cy + Cz * Cz)
        cosX = 1 if (Cx == Cy == Cz == 0) else Cz / sqrt(Cx * Cx + Cy * Cy + Cz * Cz)
        Rx = matrix([[1,0,0,0], [0,cosX,sinX,0], [0,-sinX,cosX,0], [0,0,0,1]])
        sinZ = 0 if (Cx == Cy == 0) else Cx / sqrt(Cx * Cx + Cy * Cy)
        cosZ = 1 if (Cx == Cy == 0) else Cy / sqrt(Cx * Cx + Cy * Cy)
        Rz = matrix([[cosZ,sinZ,0,0], [-sinZ,cosZ,0,0], [0,0,1,0], [0,0,0,1]])
        Ort = Rz * Rx * Mx * Pz * T
        M = Ort if (P == 'true') else Rz * Rx * Mx * Uz * Pz * T
        Points = [
            matrix([[Tx, Ty, Tz, 1.]]),
            matrix([[Tx, 0., 0., 1.]]),
            matrix([[0., Ty, 0., 1.]]),
            matrix([[0., 0., Tz, 1.]]),
            matrix([[Tx, Ty, 0., 1.]]),
            matrix([[Tx, 0., Tz, 1.]]),
            matrix([[0., Ty, Tz, 1.]])
        ]
        Axes = [
            matrix([[200, 0, 0, 1]]),
            matrix([[0, 200, 0, 1]]),
            matrix([[0, 0, 200, 1]])
        ]
        reply = list()
        for pt in Points:
            pt *= M
            pt[0,0] = pt[0,0] / pt[0,3]
            pt[0,1] = pt[0,1] / pt[0,3]
            reply.append([int(pt[0,0]), int(pt[0,1])])
        for axis in Axes:
            axis *= Ort
            reply.append([int(axis[0,0]), int(axis[0,1])])
        reply.append([int(urllib2.urlopen(urllib2.Request('http://localhost:10031', urllib.urlencode({'V' : '{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {10} {11} {12} {13}'.format(Tx,Ty,Tz,Cx,Cy,Cz,Points[0][0,0],Points[0][0,1],Points[4][0,0],Points[4][0,1],Points[5][0,0],Points[5][0,1],Points[6][0,0],Points[6][0,1])}))).read()), 0])
        self.write(json_encode(reply))

if __name__ == "__main__":
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
































