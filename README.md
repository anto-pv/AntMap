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

## Implementation

This routing application has two phases, implementing ACO algorithm for backend and implementing a Map based interface for frontend. 
so
`/app` for backend
`/web` for  frontend interface