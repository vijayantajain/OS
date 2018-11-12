// This is the main module which imports other modules to test out the functionalities

const path = require('path');
const CWD = __dirname;

const NEGATIVE_INFINITY = -1e10;
const POSITIVE_INFINITY =  1e10;

const statsModule = require(path.join('..', 'src', 'stats.js'));
var average = statsModule.average;
var max = statsModule.max;
var min = statsModule.min;
var sudden_change = statsModule.sudden_change;
var variance = statsModule.variance;
var min = statsModule.min;

//TODO
//Assert that the file path and the file name exists!
const fileName = process.argv[2];
let dataFile = require(path.join(CWD, '..', 'data', fileName));
const listOfNodes = Object.getOwnPropertyNames(dataFile);

//Assert that the variables are correct
console.log('Calculating  ' + process.argv[3]);
var target_stat = process.argv[3];
var target_variable = process.argv[4];
var target_variables; 


switch (target_stat) {
    case "average":
        target_stat = average;
        break;
    case "max":
        target_stat = max;
        break;
    case "min":
        target_stat = min;
        break;
    case "sudden_change":
        target_stat = sudden_change;
        break;
    case "variance":
        target_stat = variance;
        break;

    default:
        //text = "No value found";
}

switch (target_variable) {
    case "temperature":
        target_variables = ["arrTemperatureCPU1", "arrTemperatureCPU2"];
        break;
    case "cpu_load":
        target_variables = ["arrCPU_load"];
        break;
    case "fan_speed":
        target_variables = ["arrFans_speed1", "arrFans_speed2"];
        break;
    case "memory_usage":
        target_variables = ["arrMemory_usage"];
    default:
        //text = "No value found";
}

var vals;
var max = NEGATIVE_INFINITY;
var min = POSITIVE_INFINITY;
var reading;
var equipment;

for (node in listOfNodes){

    for (att in dataFile[listOfNodes[node]]){

        if (target_variables.includes(att)) {

            vals = target_stat(dataFile[listOfNodes[node]][att]);

            if ((vals[0]>max && process.argv[3] != "min") || (process.argv[3] == "min" && vals[0] < min)) {

                max = vals[0];
                min = vals[0];
                
                if (process.argv[3] != "average" && process.argv[3] != "variance") {
                    if (process.argv[3]=="sudden_change") reading = ", which is between reading " + vals[1] + " and reading" + (vals[1]+1) + " of ";
                    else reading = ", which is on reading " + vals[1] + " of ";
                }
                else reading = ", which is in ";

                if (target_variables.length == 1) equipment = listOfNodes[node] ;
                else {
                    if (target_variable == "temperature") equipment = att.substr(14, 4) + " of " + listOfNodes[node];
                    if  (target_variable == "fan_speed") equipment = att.substr(3, 3) + att.substr(13, 1) + " of " + listOfNodes[node];
                }   
            }
        }
    }
    if (process.argv[3] == "min") max = min;

}
console.log("The maximum " + process.argv[3] + " " + target_variable + " is " + max.toFixed(5) + reading + equipment);
