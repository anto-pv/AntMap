# DORA - Dynamic Optimized Route using ACO 

## What is our Project

Most of us use services provided by Google Maps for choosing routes. Many times
route suggestions are not accurate and are misleading. We attempt to use modified ant colony
optimization (ACO) for finding the best route for different source-destination pairs in a dynamic
road network. Services like Uber, Grab, etc. can use this algorithm to choose the best path.
Live tracking is done with the help of GPS and GPRS. Initially, the system will use google
maps for distance and time measurements.
Here we are mainly concerned with the dynamic changes that may arise during route
optimization and how each change is handled by ACO. The dynamic changes that are dealt
with in this project are redirecting routes in case of occurrence /removal of traffic jam, block,
or accident. The occurrence/removal of these hindrances is treated separately as negative and
positive changes. We introduce a method called Shaking for handling dynamic changes in the
graph that makes it real-time adaptable. Shaking is the process in which when an edge in a
graph becomes unusable, the pheromone content in all the edges related to this current edge
will change in such a way that the algorithm still selects the most optimal route. Thus any
real-time problems will not cause any hindrance in finding the optimal path.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Safari_ants.jpg/220px-Safari_ants.jpg" alt="ACO- Pheromone based ant routing" width="350" />

## Ant Colony Optimization Algorithm

<p>Route optimization is the process of improving routes for better efficiency and cost-effectiveness. Effective route optimization helps businesses maximize completed orders or deliveries while incorporating many criteria including driver schedules, available hours, total stops, fulfillment estimates, and legal requirements. Delivery routing isn’t just about finding the shortest path from point A to point B, it’s about finding the most efficient route for many different variables.</p>
<p>Ant colony optimization (ACO) is a population-based metaheuristic that can be used to find approximate solutions to difficult optimization problems.

In ACO, a set of software agents called artificial ants search for good solutions to a given optimization problem. To apply ACO, the optimization problem is transformed into the problem of finding the best path on a weighted graph. The artificial ants (hereafter ants) incrementally build solutions by moving on the graph. The solution construction process is stochastic and is biased by a pheromone model, that is, a set of parameters associated with graph components (either nodes or edges) whose values are modified at runtime by the ants. 
</>
[More about ACO algorithm](https://en.wikipedia.org/wiki/Ant_colony_optimization_algorithms)

## Implementation

<p>For the project implementation the hardware as well as the software part is to be designed. The Hardware contains GPS Module for extracting current location which can be connected to a Wifi Module or inbuilt in device. For the software part it need a front-end which works as a Map interface and back-end for executing the ACO algorithm. For a source-destination pair the distance matrix and dynamic traffic conditions are passed as an API request to back-end and the optimal path is returned using ACO with pheromone updation and shaking.</p>

```
 .
 ├── app     #for backend (ACO algorithm) implemented using FLASK
 ├── web     #for frontend interface using ReactJs
 └── ...
 ```
 
