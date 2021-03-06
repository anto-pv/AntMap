import numpy as np
import random as rn
import sys
import math
from numpy.random import choice as np_choice
from collections import Counter

def countDist(myList):
    distList= []
    for i in myList:
        distList.append(i[1])
    pathCount = dict(Counter(distList))
    for key in sorted(pathCount):
        print(f"{key}: {pathCount[key]}")

class AntColony(object):

    #Initialization
    def __init__(self, distances, tqi, n_ants, n_best, n_iterations, p_decay, alpha=1, beta=1, gamma=1):
        self.distances = distances
        self.tqi = tqi
        self.n_ants = n_ants
        self.n_best = n_best
        self.n_iterations = n_iterations
        self.index_list = []
        self.pheromone_matrix= []
        self.pheromones = np.full(self.distances.shape, 1/len(distances))
        self.decay = p_decay
        self.alpha = alpha
        self.beta = beta
        self.gamma = gamma
        self.i_pheromone = 1/len(distances)
        for i in range(len(distances)):
            self.index_list.append(i)

    def get_route(self, start, dest, shaking):
        self.start = start
        self.dest = dest
        self.shaking = shaking
        shortest_path = None
        allRoutes = None
        all_time_shortest_path = ("placeholder", np.inf)
        self.initial_pheromone()
        for i in range(self.n_iterations):
            all_paths = self.get_all_paths(start, dest)
            if not all_paths:
                continue
            self.update_pheromone(all_paths, self.n_best, shortest_path= shortest_path)
            shortest_path = min(all_paths, key=lambda x: x[1])
            longest_path = max(all_paths, key=lambda x: x[1])
            maxDist = longest_path[1]
            if(self.shaking and i==2):
                startEdge = int(input("Enter startedge: "))
                endEdge = int(input("Enter endedge: "))
                updatedValue = int(input("Enter value: "))
                if updatedValue == 0 :
                    val = np.inf
                else:
                    val = updatedValue
                self.distances[startEdge][endEdge],self.distances[endEdge][startEdge] = val, val
                self.find_shaking_nodes(self.distances, maxDist, p=0.2, startEdge=startEdge, endEdge=endEdge, updatedValue = updatedValue)
                all_time_shortest_path = ("placeholder", np.inf)
                continue
            if (self.shaking and i==5):
                pos = int(input("Enter position: "))
                value = int(input("Enter value: "))
                self.tqi[pos] = value
                self.find_link_shakenodes(self.distances, maxDist, p=0.2, node=pos)
                all_time_shortest_path = ("placeholder", np.inf)
                continue
            if shortest_path[1] < all_time_shortest_path[1]:
                all_time_shortest_path = shortest_path
            print(f"\n{i+1} Iteration: ")
            print(all_time_shortest_path)
            self.pheromone_decay()
        return all_time_shortest_path

    def initial_pheromone(self):
        for p_list in self.distances:
            temp_list=[]
            #print(p_list)
            for i in p_list:
                if i == np.inf:
                    temp_list.append(0)
                else:
                    temp_list.append(1/len(self.distances))
            #print(temp_list)
            self.pheromone_matrix.append(temp_list)


    def update_pheromone(self, all_paths, n_best, shortest_path):
        sorted_paths = sorted(all_paths, key=lambda x: x[1])
        #print(sorted_paths)
        for path, dist in sorted_paths[:n_best]:
            for move in path:
                self.pheromone_matrix[move[0]][move[1]] += 1.0 / self.distances[move]
                self.pheromone_matrix[move[1]][move[0]] = self.pheromone_matrix[move[0]][move[1]]

    def pheromone_decay(self):
        for row in self.pheromone_matrix:
            for data in row:
                data *= self.decay

    def get_all_paths(self, start, dest):
        all_paths=[]
        for i in range(self.n_ants):
            path = self.get_path(start,dest)
            if path == None:
                #print(None)
                continue
            all_paths.append((path, self.get_path_dist(path)))
        return all_paths

    def get_path_dist(self, path):
        total_dist = 0
        for ele in path:
            total_dist += self.distances[ele[0]][ele[1]] + self.tqi[ele[1]]*100
        return total_dist

    def get_actual_distance(self, path):
        total_dist = 0
        for ele in path:
            total_dist += self.distances[ele[0]][ele[1]]
        return total_dist

    def get_path(self, start, dest):
        path=[]
        visited = set()
        visited.add(start)
        prev= start

        #print(self.distances.shape)
        #print("Distances: ")
        #print(self.distances)
        #print(self.pheromones)
        for i in range(len(self.distances)-1):
            next_node = self.choose_node(self.pheromone_matrix[prev], self.distances[prev], visited)
            move = next_node
            if move == None:
                return None
            path.append((prev, move))
            prev = next_node
            visited.add(move)
            # print(path)
            if(move == dest):
                break
        # print(path)
        return path

    def choose_node(self, pheromone, distance, visited):
        for i in list(visited):
            pheromone[i] = 0
        if self.check_pheromone_empty(pheromone):
            return None
        prob_list=[]
        for j in range(len(distance)):
            row = (pheromone[j] ** self.alpha) * ((1.0 / distance[j]) ** self.beta) * ((1.0 / self.tqi[j]) ** self.gamma)
            prob_list.append(row)
        row_sum= sum(prob_list)
        prob = [ p / row_sum for p in prob_list ]
        next_node = np_choice(self.index_list, 1, p=prob)[0]
        return next_node

    def check_pheromone_empty(self, pheromone):
        flg=1
        for i in range(len(pheromone)):
            if pheromone[i] != 0:
                flg=0
                break
        if flg==1:
            return True
        else:
            return False

    def find_shaking_nodes(self, distance, maxDist, p, startEdge, endEdge , updatedValue):
        shaking_nodes_list=[]
        for i in range(len(distance)):
            sub_Colony1 = AntColony(distance,self.tqi,10,1,1,0.95,1,1,1)
            a= sub_Colony1.get_route(start= startEdge, dest= i,shaking= False)
            b= sub_Colony1.get_route(start= i, dest= endEdge, shaking= False)
            if a[1]< (p*maxDist) or b[1] < (p*maxDist):
                shaking_nodes_list.append(i)
        print("\nShaking Node List:")
        print(shaking_nodes_list)
        self.update_shaking_nodes(shaking_nodes_list, startEdge, endEdge, updatedValue)
        return shaking_nodes_list

    def find_link_shakenodes(self, distance, maxDist, p, node):
        shaking_nodes_list=[]
        for i in range(len(distance)):
            sub_Colony1 = AntColony(distance,self.tqi,10,1,1,0.95,1,1,1)
            a= sub_Colony1.get_route(start= node, dest= i,shaking= False)
            if a[1]< (p*maxDist):
                shaking_nodes_list.append(i)
        print("\nShaking Node List:")
        print(shaking_nodes_list)
        self.update_link_shakenodes(shaking_nodes_list)
        return shaking_nodes_list

    def update_shaking_nodes(self, shaking_nodes, a, b, v):
        for i in shaking_nodes:
            for j in range(len(self.distances)):
                data = self.pheromone_matrix[i][j]
                if data != 0 :
                    self.pheromone_matrix[i][j] = self.i_pheromone * (1 + math.log(data / self.i_pheromone ))
        if v == 0:
            self.pheromone_matrix[a][b], self.pheromone_matrix[b][a]= 0,0
        else:
            self.pheromone_matrix[a][b], self.pheromone_matrix[b][a]= self.i_pheromone, self.i_pheromone

    def update_link_shakenodes(self, shaking_nodes):
        for i in shaking_nodes:
            for j in range(len(self.distances)):
                data = self.pheromone_matrix[i][j]
                if data != 0 :
                    self.pheromone_matrix[i][j] = self.i_pheromone * (1 + math.log(data / self.i_pheromone ))