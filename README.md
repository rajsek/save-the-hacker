# README 

A Boilerplate template of React,redux,webpack,post-css,node,sequelize(mysql) stack

## Stack
- React
- React-router
- Redux
- Babel
- Express
- sequelize(Mysql)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Folder Structure

The folders and files are organized based on the features. 
- config - This is where the server side config resides
    - config - read config from .env and assign it to global variable
- data - This Folder holds Geolite county details and IP match
    - GeoLite2-Country.mmdb
- model - This folder holds Db Model 
- public - This folder holds all client side asserts 
- routes - This folder holds server side route
- view -This Folder holds server side handlebar template
- index.js - Main entry point which kick starts the server 

## Development Installation
Prepare your dev .env file (.env.example example)
Download to your project directory, add `README.md`, and commit:
In the project's directory, run the following commands:
### For Yarn
```
$ yarn install
$ yarn start
```
### For npm
```
$ npm install
$ npm start
```