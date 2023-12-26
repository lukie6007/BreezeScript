function calculateAverage ( input1 ) {
//do something
let average = 0;
for (let number of input1) {
average += number
}

average /= ( input1.length )
return average
}

for (let i = 0; i < 10; i++) {
console.log( i + ". Hello!" )
}


let numbers = [ 1 , 5 , 4 , 3 ];

if (( numbers.length > 5 )) {
console.log( "YES" )
} else {
console.log( "nooo" )
}


let result = ( calculateAverage ( numbers , "useless parameter" ) );

console.log( result )
