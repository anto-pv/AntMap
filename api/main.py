from importlib import resources
from flask import Flask
from flask import request
from flask_restful import  Api,Resource
import numpy as np
import json
from aco import AntColony

app = Flask(__name__)
api = Api(app)

@app.route('/distance', methods=['POST'])
def shortest_path():
    data = json.loads(request.data)
    # here is the actual code , need to give len(content.waypoints) which give node number instead of len(content)

    le = int(data['waypoints'])
    mat= np.empty((le,le))
    mat.fill(np.inf)
    for k in data['matrix']:
        print( k.split("-")[0] , data['matrix'][k])
        mat[int(k.split("-")[0]),int(k.split("-")[1])] =  data['matrix'][k]
        mat[int(k.split("-")[1]),int(k.split("-")[0])] =  data['matrix'][k]
    # print(str(mat))
    # # return str(mat)
    # return "bfbs"

    # after creating matrix the algorithm is need to be done inside route with content.desitation and content.origin json

    ant_colony = AntColony(mat, 100, 1, 10, 0.95, alpha=1, beta=1)
    shortest_path = ant_colony.get_route(start= int(data['origin']), dest= int(data['destination']), shaking=False)
    print("\nShortest Path :")
    print(shortest_path[0])
    print("\nDistance :")
    print(shortest_path[1])
    return{
        "path" : str(shortest_path[0]),
        "Distance" : str(shortest_path[1])
    }


class Helloworld(Resource):
    def get(self):
        return{"data":"Hello World"}

api.add_resource(Helloworld,"/helloworld");

if __name__ == '__main__':
    app.run(debug = True)