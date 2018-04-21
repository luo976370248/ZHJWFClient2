// var range   = require("lodash.range");
// var chalk   = require("chalk");
// var util   = require("util");


// function separator(headler, marker, color) {
//     var total = 78 - headler.length;
//     var data = '';
//     var prefixSpace = 3;
//     range(total).forEach((element, index) => {
//         if (index === prefixSpace) {
//             data += `${headler}`;
//         }
//         data += marker;
//     });

//     return chalk[color][data];
// }

// function debugFunction(obj) {
//     return obj.toString();
// }

// function debugInspect(obj) {
//     return util.inspect(obj, { depth: null });
// }

// function debug(obj) {
//     var header, content;

//     if (obj === null) {
//         header  = separator("Null", '-', 'green');
//         content = 'There is no object to debug';
//         return [header, content];
//     }

//     switch (typeof obj) {
//         case 'function':
//         header  = separator("Function", '-', 'green');
//         content = debugFunction(obj);
//         break;
//         case 'string':
//         header  = separator("String", '-', 'green');
//         content = debugInspect(obj);
//         break;
//         case 'number':
//         header  = separator("Number", '-', 'green');
//         content = debugInspect(obj);
//         break;
//         case 'boolean':
//         header  = separator("Boolean", '-', 'green');
//         content = debugInspect(obj);
//         break;
//         case 'undefined':
//         header  = separator("Undefined", '-', 'green');
//         content = 'Undefined object has no data to show';
//         break;
//         default:
//         header  = separator("inspect", '-', 'green');
//         content = debugInspect(obj);
//         break;
//     }

//     return [header, content];
// }

// function parseObj(obj) {
//   var [header, content] = debug(obj);
//   return content;
// }

// module.exports  = parseObj
