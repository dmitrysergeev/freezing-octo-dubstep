#coding: utf-8
import tornado.ioloop
import tornado.options
import tornado.web
import os.path
from tornado.options import define, options
from tornado.escape  import json_encode, json_decode
from numpy import *
define("port", default=10040, help="run on the given port", type=int)
class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
        ]
        settings = dict(
            autoescape = None 
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.post()

    def post(self):
        vars = list(map(float, self.get_argument('V').split()))
        res = 1
        if (vars[6] < 0 or vars[6] > 400 or vars[7] < 0 or vars[7] > 400 or vars[8] < 0 or vars[8] > 400 or vars[9] < 0 or vars[9] > 400 or vars[10] < 0 or vars[10] > 400 or vars[11] < 0 or vars[11] > 400 or vars[12] < 0 or vars[12] > 400 or vars[13] < 0 or vars[13] > 400):
            res = 0
        if(vars[0] == vars[3] and vars[1] == vars[4] and vars[2] == vars[5] or vars[3] == vars[4] == vars[5] == 0):
            res = 0
        cosA = ((vars[0]-vars[3])*vars[3] * (-1)+(vars[1] - vars[4])*vars[4]* (-1)+(vars[2]-vars[5])*vars[5]* (-1)) / (sqrt(vars[0]*vars[0] + vars[1]*vars[1]+vars[2]*vars[2]) * sqrt((vars[0]-vars[3])*(vars[0]-vars[3])+(vars[1]-vars[4])*(vars[1]-vars[4])+(vars[2]-vars[5])*(vars[2]-vars[5])))
        if(cosA <= 0):
            res = 0
        self.write(json_encode(res))
        
if __name__ == "__main__":
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
